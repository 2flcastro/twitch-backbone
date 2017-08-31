/*
  This is another version of the channels-list route. In this version the steps
  for retrieving the data from the Twitch API are seperated into different
  functions AND taken out of the body of the route.

  Declaring the functions outside of the body of the route means that there
  will no longer be access to variables defined within the scope of the route's
  callback, so objects containing the data are passed along each function call.

  Additionally a final funcition is created to signal that the API calls have
  all been made and it is time to send the data back to the client.

  Overall, the asynchronous nature of the code is managed through counters that
  then call the next function at the appropiate time and the final step is
  accomplished through a closure that is used to access the scope of the
  route's callback function. 
*/

var express = require('express');
var https = require('https');
var twitchID = require('../credentials').twitch.clientID;

// Needs to be declared in a global context to become accessible as the last
// function to call in the chain of API calls.
var allDataRetrieved;

var router = express.Router();

router.get('/channels-list', function(req, res) {
  // Needs to be assigned within the scope of the router body to have access
  // to the 'res' object.
  allDataRetrieved = function(data) {
    console.log('All data retrieved called');
    res.json(data);
  };

  // Start the calls to Twitch API...
  getTwitchData();
});


function getTwitchData() {
  // Get list of channels from database
  // ...
  var channels = getChannelList();

  var channelsData = {};
  channels.forEach(function(channel) { channelsData[channel] = {} });

  getChannelIds(channels, channelsData);
}


function getChannelList() {
  // Get list of channels from database based on user
  // ...

  return ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp",
    "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin",
    "comster404", "clwnbaby", "MOONMOON_OW", "12TimeWeCCG", "puncayshun",
    "1twoQ", "MajinPhil", "bunniemuffin", "EEvisu", "DrDisRespectLIVE"];
}


function getChannelIds(channels, channelsData) {
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
        channelsData[channel].twitchId = data.users.length ? data.users[0]._id : null;
        channelsData[channel].closed = data._total ? false : true;

        counter++;

        // Once all ids have been obtained gather channel data via getChannelData()
        if (counter === channels.length) {
          getChannelData(channels, channelsData);
        }

      });
    });

    idsReq.on('error', function(e) { console.error(e) });
    idsReq.end();
  });
}


function getChannelData(channels, channelsData) {
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
          getStreamData(channels, channelsData);
        }
      });
    });

    channelsReq.on('error', function(e) { console.error(e) });
    channelsReq.end();
  });
}


function getStreamData(channels, channelsData) {
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
          finalData = [];
          channels.forEach(function(channel) {
            finalData.push(channelsData[channel]);
          });
          // Make call to final function
          allDataRetrieved(finalData);
        }
      });
    });

    streamsReq.on('error', function(e) { console.error(e) });
    streamsReq.end();
  });
}

module.exports = router;
