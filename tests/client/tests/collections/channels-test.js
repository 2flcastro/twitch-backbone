var test = require('tape');
var sinon =  require('sinon');

// channels collection
var Channels = require('../../../../src/backbone/collections/channels');

// channelsList view
var ChannelsList = require('../../../../src/backbone/views/channel-list');


module.exports = function() {
  test('Channels collection is initialized correctly', function(t) {
    // ARRANGE - create new instance of Channels collection
    var channels = new Channels();

    // ASSERT
    t.equal(channels.length, 0, 'Channels collection is empty on initialization');
    t.equal(channels.url, '/channels/channels-list', 'Channels collection url is set');

    t.end();
  });

  test('ChannelsList view should initialize and populate a Channels collection', function(t) {
    // ARRANGE
    // Create fake server for XHR calls
    var fakeServer = sinon.fakeServer.create();
    fakeServer.respondImmediately = true;
    fakeServer.respondWith('GET', '/channels/channels-list',
      [200, { 'Content-Type': 'application/json' }, JSON.stringify([{ name: 'Fake Channel', twitchId: 1 }])]);
    // Replace Channels colleciton fetch method with a sinon spy
    sinon.spy(Channels.prototype, 'fetch');

    // Creating an instance of ChannelsList and assign it 'channels' collection
    var channelsList = new ChannelsList();
    // ACT - render channelList, trigger fetch on its collection
    channelsList.render();
    // ASSERT
    t.ok(channelsList.collection.fetch.calledOnce, 'Initializing channelList view should call channels fetch method');
    t.equal(channelsList.collection.length, 1, 'Channels collection should have one model set');
    t.equal(fakeServer.requests.length, 1, 'Channels fetch method made one XHR call');
    t.equal(fakeServer.requests[0].method, 'GET', 'Channels fetch method made a GET request');
    t.equal(fakeServer.requests[0].url, '/channels/channels-list', 'Channels fetch method used correct url for request');

    // Restore sinon spy and fake server
    Channels.prototype.fetch.restore();
    fakeServer.restore();
    // End tests
    t.end();
  });
};
