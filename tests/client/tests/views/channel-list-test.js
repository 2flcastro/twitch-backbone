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
    // Create fake server for future XHR calls and sinon spies
    var fakeServer = sinon.fakeServer.create();
    fakeServer.respondImmediately = true;
    fakeServer.respondWith('GET', '/channels/channels-list',
      [200, { 'Content-Type': 'application/json' }, JSON.stringify([{ name: 'Fake Channel', twitchId: 1 }])]);

    sinon.spy(ChannelListView.prototype, 'addChannel');
    sinon.spy(ChannelsCollection.prototype, 'fetch');

    // ACT
    var channelList = new ChannelListView();
    channelList.render();

    // ASSERT
    t.equal(channelList.render(), channelList, 'Rendering ChannelList view will return itself')
    // Using DOM Elment API "tagName" and "classList" to find view's element tag and classes
    t.equal(channelList.el.tagName, 'DIV', 'ChannelList view renders with a "div" element');
    t.ok(channelList.el.classList.contains('channels'), 'ChannelList view el has the class "channels"');

    // Test that collection behaves appropiate on view redering
    // Since we call the render method twice we have two of the same XHR calls
    t.ok(channelList.collection.fetch.called, 'ChannelList collection\'s fetch method was called when view rendered');
    t.ok(fakeServer.requests.length, 'An XHR request was made');
    t.equal(fakeServer.requests[0].method, 'GET', 'A GET request was made');
    t.equal(fakeServer.requests[0].url, '/channels/channels-list', 'A request to the url /channels/channel-list was made');
    t.ok(channelList.addChannel.called, 'ChannelList "addChannel" method was called');
    // An instance of 'Channel' view should be rendered and appened to ChannelList
    t.equal(channelList.$el.find('.channel-container').length, 1, 'ChannelList contains a nested Channel view');


    // Replace original XHR construct
    fakeServer.restore();
    // Replace ChannelsCollection fetch method
    ChannelListView.prototype.addChannel.restore();
    ChannelsCollection.prototype.fetch.restore();
    // End tests
    t.end();
  });


  test('ChannelList "filterChannels" method works properly', function(t) {
    // ARRANGE
    // Create a sinon fake server that will return channels that are streaming and offline
    var fakeServer = sinon.fakeServer.create();
    fakeServer.respondImmediately = true;
    fakeServer.respondWith('GET', '/channels/channels-list', [200, { 'Content-Type': 'application/json' },
      JSON.stringify([
        { name: 'Channel 1', twitchId: 1, streaming: true },
        { name: 'Channel 2', twitchId: 3, streaming: false}
    ])]);

    // Create sinon spy
    sinon.spy(ChannelListView.prototype, 'filterChannels');


    // ACT
    // Create a new instance of ChannelView
    var channelList = new ChannelListView();
    var channelCollection = channelList.collection;
    channelList.render(); // This will cause collecttion to fetch the fake models

    // Add a "currentFilter" attribute to each model as a way to verify that the
    // "toggleFilterVisible" event has been triggered and with the correct filter
    channelCollection.models.forEach(function(model) {
      model.on('toggleFilterVisible', function(filter) {
        this.set('currentFilter', filter);
      }, model);
    });

    // Make a reference to all models in collection
    var firstChannel = channelCollection.at(0);
    var secondChannel = channelCollection.at(1);

    // DOM References for filters
    var filterAll = channelList.$el.find('.filter-choice-all');
    var filterStreaming = channelList.$el.find('.filter-choice-streaming');
    var filterOffline = channelList.$el.find('.filter-choice-offline');


    // ASSERT
    filterAll.click(); // Simulate click on the "all" filter
    t.ok(channelList.filterChannels.calledOnce, 'ChannelList "filterChannels" method is called');
    t.equal(firstChannel.get('currentFilter'), 'all', 'The "toggleFilterVisible" event is triggered on first channel with a filter of "all"');
    t.equal(secondChannel.get('currentFilter'), 'all', 'The "toggleFilterVisible" event is triggered on second channel with a filter of "all"');

    filterStreaming.click(); // Simulate click on the "streaming" filter
    t.ok(channelList.filterChannels.calledTwice, 'ChannelList "filterChannels" method is called');
    t.equal(firstChannel.get('currentFilter'), 'streaming', 'The "toggleFilterVisible" event is triggered on first channel with a filter of "streaming"');
    t.equal(secondChannel.get('currentFilter'), 'streaming', 'The "toggleFilterVisible" event is triggered on second channel with a filter of "streaming"');

    filterOffline.click(); // Simulate click on the "offline" filter
    t.ok(channelList.filterChannels.calledThrice, 'ChannelList "filterChannels" method is called');
    t.equal(firstChannel.get('currentFilter'), 'offline', 'The "toggleFilterVisible" event is triggered on first channel with a filter of "offline"');
    t.equal(secondChannel.get('currentFilter'), 'offline', 'The "toggleFilterVisible" event is triggered on second channel with a filter of "offline"');


    // Replace original XHR construct
    fakeServer.restore();
    // Restore sinon spy
    ChannelListView.prototype.filterChannels.restore();
    t.end();
  });


  test('ChannelList view searchChannels method works properly', function(t) {
    // ARRANGE
    // Create a sinon fake server that will return channels that are streaming and offline
    var fakeServer = sinon.fakeServer.create();
    fakeServer.respondImmediately = true;
    fakeServer.respondWith('GET', '/channels/channels-list', [200, { 'Content-Type': 'application/json' },
      JSON.stringify([
        { name: 'Channel 1' },
    ])]);

    // Create sinon spy for "searchChannels" method
    sinon.spy(ChannelListView.prototype, 'searchChannels');


    // ACT
    var channelList = new ChannelListView();
    var channelCollection = channelList.collection;
    channelList.render();

    // Add a "matched" attribute to each model as a way to verify that the
    // "toggleMatchVisible" event has been triggered and with correct match parameter
    channelCollection.models.forEach(function(model) {
      model.on('toggleMatchVisible', function(query) {
        this.set('matched', query);
      }, model);
    });

    // Make reference to model in the collection
    var firstModel = channelCollection.at(0);

    // DOM references
    var searchBar = channelList.$el.find('.search-bar');
    var searchBtn = channelList.$el.find('.search-btn');


    // ASSERT
    searchBar.val('nonMatchingName'); // Set a search query value beforehand
    searchBar.keyup(); // Simulate keyup event on search bar
    t.ok(channelList.searchChannels.calledOnce, 'The "searchChannels" method is called on keyup event');
    t.equal(firstModel.get('matched'), null,  'The "toggleMatchVisible" event is triggered on keyup with non-matching search query');

    // Test search with a matching query
    searchBar.val('Channel 1'); // Actual "name" attribute of fake model above
    searchBar.keyup();
    t.ok(channelList.searchChannels.calledTwice, 'The "searchChannels" method is called once more on keyup event');
    t.ok(firstModel.get('matched'), 'The "toggleMatchVisible" event is triggred on keyup with a matching search query');


    // Test the same search functionality but with click event
    searchBar.val('nonMatchingName');
    searchBtn.click(); // Simulate click event on search bar
    t.equal(firstModel.get('matched'), null,  'The "toggleMatchVisible" event is triggered on click with non-matching search query');

    searchBar.val('Channel 1'); // Actual "name" attribute of fake model above
    searchBtn.click();
    t.ok(firstModel.get('matched'), 'The "toggleMatchVisible" event is triggred on click with a matching search query');


    // Replace original XHR construct
    fakeServer.restore();
    // Restore sinon spy
    ChannelListView.prototype.searchChannels.restore();
    t.end();
  });
};
