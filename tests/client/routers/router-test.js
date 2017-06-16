var test = require('tape');
var sinon = require('sinon');

var Router = require('../../../src/backbone/routers/router');
var ChannelsListView = require('../../../src/backbone/views/channelsList');
var ChannelsCollection = require('../../../src/backbone/collections/channels');


// BACKBONE ROUTER TESTS
module.exports = function routerTests() {
  test('Router has four routes and a route handler for each', function(t) {
    // ACT
    // - Get list of routes from router
    var router = new Router();
    var routes = Object.keys(router.routes);


    // ASSERT
    t.equal(routes.length, 4, 'Router should have four routes');
    routes.forEach(function(route) {
      var handlerName = router.routes[route];
      var handler = router[handlerName];
      t.equal(typeof handler, 'function', 'Router has a handler for "' + route + '" route');
    });

    t.end();
  });


  test('Tests for home route', function(t) {
    // ARRANGE
    // - Replace the router's home handler with a sinon spy
    // - Replace the router's navigate method with a sinon spy
    var handler = Router.prototype.routes[''];
    sinon.spy(Router.prototype, handler);
    sinon.spy(Router.prototype, 'navigate');


    // ACT
    var router = new Router();
    router[handler](); // Call home route handler


    // ASSERT
    t.ok(router[handler].calledOnce, 'Home route calls it\'s assigned handler once');
    t.ok(router.navigate.calledOnce, 'The router\'s navigate function was called once');
    t.ok(router.navigate.calledWith('view/channels', { trigger: true }), 'The home route redirects to "view/channels" route');


    // Restore original Router.prototype methods
    Router.prototype[handler].restore();
    Router.prototype.navigate.restore();
    router.stop();  // Calls Backbone.history.stop()
    t.end();  // End test case
  });


  test('Tests for "view/channels" route', function(t) {
    // ARRANGE
    // - Replace the router's "view/channels" handler with a sinon spy
    var handler = Router.prototype.routes['view/channels'];
    sinon.spy(Router.prototype, handler);

    // Create fake server for future XHR calls
    var fakeServer = sinon.fakeServer.create();
    fakeServer.respondImmediately = true;
    fakeServer.respondWith('GET', '/channels/channels-list',
      [200, { 'Content-Type': 'application/json' }, JSON.stringify([{ name: 'Fake Channel', twitchId: 1 }])]);


    // ACT
    var router = new Router();
    router[handler](); // Call "view/channels" route handler


    // ASSERT
    t.ok(router[handler].calledOnce, 'Route "view/channels" calls the "viewChannels" handler function');

    // Check if route creates a new ChannelsList view
    t.ok(router.currentView, 'There should now be a current view set on the router');
    t.equal(router.currentView.constructor, ChannelsListView, 'The current view is an instance of ChannelsListView');

    // Check if router creates a new Channels collection and assigns it to current view
    t.ok(router.currentView.collection, 'There should be a collection on the current view');
    t.equal(router.currentView.collection.constructor, ChannelsCollection, 'The current view\'s collection is an instance of ChannelsCollection');
    t.equal(router.currentView.collection.length, 1, 'The current views\'s collection has length of 1');
    t.equal(router.currentView.collection.at(0).get('name'), 'Fake Channel', 'First item in current view\'s collection has a name of "Fake Channel"');
    t.equal(router.currentView.collection.at(0).get('twitchId'), 1, 'First item in current view\'s collection has a twitchId of "1"');

    // A call to 'channels/channels-list' should have been made
    t.equal(fakeServer.requests.length, 1, 'Router makes a request to the server');
    t.equal(fakeServer.requests[0].method, 'GET', 'Router makes a GET request');
    t.equal(fakeServer.requests[0].url, '/channels/channels-list', 'Router makes an XHR request to /channels/channels-list');


    Router.prototype[handler].restore();
    fakeServer.restore();
    router.stop();
    t.end();
  });


  test('Router "search/channels/:query" route tests', function(t) {
    // ARRANGE
    // Replace the router's "search/channels" handler with a sinon spy
    var handler = Router.prototype.routes['search/channels/:query'];
    sinon.spy(Router.prototype, handler);


    // ACT
    var router = new Router();
    router[handler]('1'); // Call route handler with query of 1


    // ASSERT
    t.ok(router[handler].calledOnce, 'The "search/channels/:query" route calls appropriate handler once');
    t.ok(router[handler].calledWith('1'), 'The "search/channels/:query" handler is called with a query of 1');
    // ...


    Router.prototype[handler].restore();
    router.stop();
    t.end();
  });


  test('Router "edit/channels" route tests', function(t) {
    // ARRANGE
    // Replace the router's "edit/channels" handler with a sinon spy
    var handler = Router.prototype.routes['edit/channels'];
    sinon.spy(Router.prototype, handler);


    // ACT
    var router = new Router();
    router[handler]();


    // ASSERT
    t.ok(router[handler].calledOnce, 'The "edit/channels" route calls appropriate handler once');
    // ...


    Router.prototype[handler].restore();
    router.stop();
    t.end();
  });


  // This test case tests the functionality of the router.start() and router.navigate()
  // functions across several different routes. Keeping in mind that calling
  // these two functions will modify the browser's URL we need return the
  // final state of the URL to the home route "#" without triggering it's handler:
  // ---> router.navigate('', { trigger: false })
  // This ensures that future router tests start off with a "clean" URL state
  // and not the one this series of tests will result in ("view/channels").
  test('Router can navigate across different routes', function(t) {
    // ARRANGE
    // Replace router handler functions with sinon spies
    var routes = Object.keys(Router.prototype.routes);
    var handlers = [];
    routes.forEach(function(route) {
      handler = Router.prototype.routes[route];
      if (handlers.indexOf(handler) === -1 ) { handlers.push(handler); };
    });
    handlers.forEach(function(handler) {
      sinon.spy(Router.prototype, handler);
    });

    // Create fake router
    var fakeServer = sinon.fakeServer.create();
    fakeServer.respondImmediately = true;
    fakeServer.respondWith('GET', '/channels/channels-list',
      [200, { 'Content-Type': 'application/json' }, JSON.stringify([{ name: 'Fake Channel', twitchId: 1 }])]);


    // ACT
    var router = new Router();
    router.start(); // Will call the home route by default
    router.navigate('edit/channels', { trigger: true }); // Go to 'edit/channels' route
    router.navigate('view/channels', { trigger: true }); // Go to 'view/channels' route
    router.navigate('search/channels/1', { trigger: true }); // Got to 'search/channels/:query' route
    router.navigate('', { trigger: true }); // Finally, return to home route ---> redirects to 'view/channels' route
    router.navigate('', { trigger: false }); // Will set back the url to "#" for future tests without triggering handler


    // ASSERT
    t.ok(router[router.routes['']].calledTwice, 'The home route\'s handler was called twice');
    t.ok(router[router.routes['view/channels']].calledThrice, 'The view/channels route handler was called thrice');
    t.ok(router[router.routes['edit/channels']].calledOnce, 'The "edit/channels" handler was called');
    t.ok(router[router.routes['search/channels/:query']].calledOnce, 'The "search/channels/:query" handler was called');
    t.ok(router[router.routes['search/channels/:query']].calledWith('1'), 'The "search/channels/:query" handler was called with query "1"');

    // A call to 'channels/channels-list' should have been made 3 times by 'view/channels' route
    t.equal(fakeServer.requests.length, 3, 'Router makes 3 requests to the server');
    t.equal(fakeServer.requests[0].method, 'GET', 'Router makes a GET request');
    t.equal(fakeServer.requests[0].url, '/channels/channels-list', 'Router makes an XHR request to /channels/channels-list');
    t.equal(fakeServer.requests[1].method, 'GET', 'Router makes a GET request');
    t.equal(fakeServer.requests[1].url, '/channels/channels-list', 'Router makes an XHR request to /channels/channels-list');
    t.equal(fakeServer.requests[2].method, 'GET', 'Router makes a GET request');
    t.equal(fakeServer.requests[2].url, '/channels/channels-list', 'Router makes an XHR request to /channels/channels-list');


    // Resotore all original Router.prototype methods, end test case
    handlers.forEach(function(handler) {
      Router.prototype[handler].restore();
    });
    fakeServer.restore();
    router.stop();
    t.end();
  });


  test('Router sets current view properly', function(t) {
    // ARRRANGE
    // - Replace Router's 'removeCurrentView' function with sinon spy
    sinon.spy(Router.prototype, 'removeCurrentView');

    // Create fake router
    var fakeServer = sinon.fakeServer.create();
    fakeServer.respondImmediately = true;
    fakeServer.respondWith('GET', '/channels/channels-list',
      [200, { 'Content-Type': 'application/json' }, JSON.stringify([{ name: 'Fake Channel', twitchId: 1 }])]);

    // ACT
    var router = new Router();

    // ASSERT
    // router.currentView refers to the current view rendered by the router
    t.equal(router.currentView, null, 'Router starts off with no current view in place');

    // ACT
    // - Default home route will redirect to "view/channels". setting a new view
    router.start();

    // ASSERT
    t.ok(router.removeCurrentView.calledOnce, 'The router\'s "removeCurrentView" method should have been called once');
    t.ok(router.currentView, 'Router sets a current view when navigating to "view/channels" route');
    t.equal(router.currentView.constructor, ChannelsListView, 'The current view is an instance of ChannelsListView');

    // ACT
    // - Navigate to 'edit/channels' route to replace current view
    router.navigate('edit/channels', { trigger: true });

    // ASSERT
    t.ok(router.removeCurrentView.calledTwice, 'The router\'s "removeCurrentView" method should have been called again');
    t.equal(router.currentView, null, 'The current view should now be set to "null"');


    router.navigate('', { trigger: false }); // Reset the browser's URL to home "#" default

    Router.prototype.removeCurrentView.restore();
    router.stop();
    fakeServer.restore();
    t.end();
  });
};
