var test = require('tape');
var sinon = require('sinon');

var ChannelListView = require('../../../../src/backbone/views/channel-list');
var ChannelModel = require('../../../../src/backbone/models/channel')
var ChannelsCollection = require('../../../../src/backbone/collections/channels');

module.exports = function() {
  test('ChannelsList View initializes properly', function(t) {
    // ARRANGE + ACT - create a new instance of channelList view
    var channelList = new ChannelListView();

    // ASSERT
    t.ok(channelList.collection, 'channelList view has a collection');
    t.ok(channelList.collection instanceof ChannelsCollection, 'channelList view\'s collection is an instance of Channels collection');

    t.end();
  });

  test('ChannelList view renders properly', function(t) {
    // ARRANGE
    // Create fake server for future XHR calls
    var fakeServer = sinon.fakeServer.create();
    fakeServer.respondImmediately = true;
    fakeServer.respondWith('GET', '/channels/channels-list',
      [200, { 'Content-Type': 'application/json' }, JSON.stringify([{ name: 'Fake Channel', twitchId: 1 }])]);
    // Replace Channels colleciton fetch method with a sinon spy
    sinon.spy(ChannelsCollection.prototype, 'fetch');

    // ACT
    var channelList = new ChannelListView();
    channelList.render();

    // ASSERT
    t.equal(channelList.render(), channelList, 'Rendering ChannelList view will return itself')
    // Using DOM Elment API "tagName" and "classList" to find view's element tag and classes
    t.equal(channelList.el.tagName, 'DIV', 'ChannelList view renders with a "div" element');
    t.ok(channelList.el.classList.contains('channels-list'), 'ChannelList view el has the class "channels-list"');

    // Test that collection behaves appropiate on view Rendering
    // Since we call the render method twice we have two of the same XHR calls
    t.ok(channelList.collection.fetch.called, 'ChannelList collection\'s fetch method was called when view rendered');
    t.ok(fakeServer.requests.length, 'An XHR request was made');
    t.equal(fakeServer.requests[0].method, 'GET', 'A GET request was made');
    t.equal(fakeServer.requests[0].url, '/channels/channels-list', 'A request to the url /channels/channel-list was made');


    // Replace original XHR construct
    fakeServer.restore();
    // Replace ChannelsCollection fetch method
    ChannelsCollection.prototype.fetch.restore();
    // End tests
    t.end();
  });

  test('ChannelList addChannel method functions properly', function(t) {
    // ARRANGE
    // Replace Channels colleciton fetch method with a sinon spy
    sinon.spy(ChannelsCollection.prototype, 'fetch');
    // Replace ChannelListView addChannel method with sinon spy
    sinon.spy(ChannelListView.prototype, 'addChannel');

    // ACT
    var channelList = new ChannelListView();
    var channelListCollection = channelList.collection; // Isolate the collection of channelList instance
    // Add a new model to collection and trigger the 'addChannel' event listener
    channelListCollection.add({ name: 'Fake Channel', twitchId: 1 });

    // ASSERT
    t.ok(channelList.addChannel.calledOnce, 'ChannelList "addChannel" method was called');
    // An instance of Channel view should be rendered and appeneded to ChannelList after addChannel is triggered
    t.equal(channelList.$el.find('.channel-container').length, 1, 'ChannelList view el should have a child element');


    // Restore sinon spies
    ChannelsCollection.prototype.fetch.restore();
    ChannelListView.prototype.addChannel.restore();

    t.end();
  });

  test('ChannelList view removes properly', function(t) {
    // ARRANGE
    // Replace Channels colleciton reset method with a sinon spy
    sinon.spy(ChannelsCollection.prototype, 'reset');

    // ACT
    var channelList = new ChannelListView();
    // Trigger a 'remove' event on the view to make the collection reset
    channelList.trigger('remove');

    // ASSERT
    t.ok(channelList.collection.reset.calledOnce, 'ChannelList resets it\'s collection when removed');


    // Restore sinon spy
    ChannelsCollection.prototype.reset.restore();

    t.end();
  });
};
