var express = require('express');
var router = express.Router();
var https = require('https');
var twitchID = require('../credentials').twitch.clientID;

router.get('/channels-list', function(request, response) {
  // Get list of channels from database
  // ...
  var channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp",
    "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin",
    "comster404", "clwnbaby", "MOONMOON_OW", "12TimeWeCCG", "puncayshun",
    "1twoQ", "MajinPhil", "bunniemuffin", "EEvisu"];


  // Three steps for getting data from Twitch API v5
  // 1. Acquire ID for each channel via getChannelIds()
  // 2. Use channel IDs to get channel data via getChannelData()
  // 3. Use channel IDs to get streaming data via getStreamData()

  // Creat an array of objects with each channels's data
  var channelsData = {};

  // Start calls to Twitch API
  getChannelIds();

  function getChannelIds() {
    // Keep track of async Twitch API responses
    var counter = 0;

    // Gather channels' data from Twitch API
    channels.forEach(function(channel) {
      var idsReq = https.request({
        hostname: 'api.twitch.tv',
        path: '/kraken/users?login=' + channel,
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.twitchtv.v5+json',
          'Client-ID': twitchID
        }
      }, function(res) {
        // console.log('statusCode: ', res.statusCode);
        // console.log('headers: ', res.headers);

        var data = '';
        res.on('data', function(chunk) { data += chunk });
        res.on('end', function() {
          data = JSON.parse(data);
          // Create object for each channel in channelsData
          channelsData[channel] = {};
          channelsData[channel].twitchId = data.users.length ? data.users[0]._id : null;
          channelsData[channel].closed = data._total ? false : true;

          counter++;

          // Once all ids have been obtained gather channel data via getChannelData()
          if (counter === channels.length) {
            getChannelData();
          }

        });
      });

      idsReq.on('error', function(e) { console.error(e) });
      idsReq.end();
    });
  }

  function getChannelData() {
    // Keep track of async Twitch API responses
    var counter = 0;

    channels.forEach(function(channel) {
      var channelsReq = https.request({
        hostname: 'api.twitch.tv',
        path: '/kraken/channels/' + channelsData[channel].twitchId,
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.twitchtv.v5+json',
          'Client-ID': twitchID
        }
      }, function(res) {
        // console.log('statusCode: ', res.statusCode);
        // console.log('headers: ', res.headers);

        var data = '';
        res.on('data', function(chunk) { data += chunk });
        res.on('end', function() {
          data = JSON.parse(data);
          // Make sure channel exists
          if (data.status !== 404) {
            channelsData[channel].name = data.display_name;
            channelsData[channel].url = data.url;
            channelsData[channel].logo = data.logo || 'https://static-cdn.jtvnw.net/jtv_user_pictures/test_channel-profile_image-94a42b3a13c31c02-300x300.png';
            channelsData[channel].followers = data.followers;
          } else {
            // Assuming channel does not exist...
            channelsData[channel].name = channel;
            channelsData[channel].url = null;
            channelsData[channel].logo = 'https://static-cdn.jtvnw.net/jtv_user_pictures/test_channel-profile_image-94a42b3a13c31c02-300x300.png';
            channelsData[channel].followers = 0;
          }

          counter++;

          // Once all responses come back, get streaming data via getStreamData()
          if (counter === channels.length) {
            getStreamData();
          }
        });
      });

      channelsReq.on('error', function(e) { console.error(e) });
      channelsReq.end();
    });
  }

  function getStreamData() {
    // Keep track of async Twitch API responses
    var counter = 0;

    channels.forEach(function(channel) {
      var streamsReq = https.request({
        hostname: 'api.twitch.tv',
        path: '/kraken/streams/' + channelsData[channel].twitchId,
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.twitchtv.v5+json',
          'Client-ID': twitchID
        }
      }, function(res) {
        // console.log('statusCode: ', res.statusCode);
        // console.log('headers: ', res.headers);

        var data = '';
        res.on('data', function(chunk) { data += chunk });
        res.on('end', function() {
          data = JSON.parse(data);
          // For channels with closed accounts
          if (data.status == 400) {
            channelsData[channel].streaming = null;
            channelsData[channel].streamingDesc = null;
            channelsData[channel].viewers = 0;
            channelsData[channel].streamPreview = null;
          } else if (data.stream) {
            // If channel is currently streaming set data
            channelsData[channel].streaming = true
            channelsData[channel].streamDescription = 'Streaming: ' + data.stream.game;
            channelsData[channel].viewers = data.stream.viewers;
            channelsData[channel].streamPreview = data.stream.preview.large;
          } else {
            // Channel is not streaming set default data
            channelsData[channel].streaming = false;
            channelsData[channel].streamDescription = 'Offline';
            channelsData[channel].viewers = 0;
            channelsData[channel].streamPreview = null;
          }

          counter++;
          if (counter === channels.length) {
            clientData = [];
            channels.forEach(function(channel) {
              clientData.push(channelsData[channel]);
            });
            // Send complete channel and streaming data back to client
            response.json(clientData);
          }
        });
      });

      streamsReq.on('error', function(e) { console.error(e) });
      streamsReq.end();
    });
  }
});

module.exports = router;
