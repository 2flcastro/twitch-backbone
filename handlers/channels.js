var https = require('https');
var twitchID = require('../credentials').twitch.clientID;

/*
  This Express route uses several functions to collect and assemble data
  from the Twitch API:
  1. getChannelList() - retrieves the list of channels from the database based
     on the current user.
  2. getchannelIds() - uses the list of channels to obtain the Twitch ID
     associated with each channel.
  3. getChannelData() - uses the list of channels and the channel IDs to
     retrieve channel specific data for each channel.
  4. getChannelStream() - uses the list of channels and channel IDs to
     retrieve streaming data for each channel.
  5. getTwitchData() - is responsible for calling the above functions to make
     the API calls, extract the relevant data after each call, and assembles the
     data for all channels that is sent back to the client.
*/

function getChannelList() {
  // Gets a list of channels from database based on user
  // ...

  // For development purposes, just return a predefined list of Twitch channels...
  return ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp",
    "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin",
    "comster404", "clwnbaby", "MOONMOON_OW", "12TimeWeCCG", "puncayshun",
    "1twoQ", "MajinPhil", "bunniemuffin", "EEvisu", "DrDisRespectLIVE",
    "Venis_Gaming", "Elajjaz", "imapi", "xXScreamKiwiXx"];
}


function getChannelIds(channels) {
  // Acquire channel IDs from Twitch API.
  // ARGUMENTS
  // - channels: array containing list of channels
  // Returns a promise through Promise.all() which resolves with API data.

  // Create an array of promises, one for each channel, to be used later
  // with Promise.all()
  var promises = channels.map(function(channel) {
    return new Promise(function(resolve, reject) {
      var idsReq = https.request({
        hostname: 'api.twitch.tv',
        path: '/kraken/users?login=' + channel,
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.twitchtv.v5+json',
          'Client-ID': twitchID
        }
      }, function(res) {
        var data = '';
        res.on('data', function(chunk) { data += chunk });
        res.on('end', function() { resolve(JSON.parse(data)); });
      });

      // If there is an error with API call reject the promise
      idsReq.on('error', function(err) {
        console.error('Error retrieving channel IDs: \n', err);
        reject(err);
      });
      idsReq.end();
    });
  });

  // Returns a promise through Promise.all()
  return Promise.all(promises).then(function(channelIds) {
    return channelIds;
  }).catch(function(err) {
    console.error('Error retrieving channel IDs: \n', err);
  });
}


function getChannelData(channels, channelsData) {
  // Acquires channel specific data from Twitch API.
  // ARGUMENTS
  // - channels: array containing the list of channels
  // - channelsData: object with channels' info including ids (twitchId)
  // Returns a promise through Promise.all() which resolves with API data.

  var promises = channels.map(function(channel) {
    return new Promise(function(resolve, reject) {
      var channelsReq = https.request({
        hostname: 'api.twitch.tv',
        path: '/kraken/channels/' + channelsData[channel].twitchId,
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.twitchtv.v5+json',
          'Client-ID': twitchID
        }
      }, function(res) {
        var data = '';
        res.on('data', function(chunk) { data += chunk });
        res.on('end', function() { resolve(JSON.parse(data)); });
      });

      channelsReq.on('error', function(err) {
        console.error('Error retrieving channel specific data: \n', err);
        reject(err)
      });
      channelsReq.end();
    });
  });

  return Promise.all(promises).then(function(channelData) {
    return channelData;
  }).catch(function(err) {
    console.error('Error retrieving channel specific data: \n', err);
  });
}

function getStreamData(channels, channelsData) {
  // Acquires channel streaming data from Twitch API.
  // ARGUMENTS
  // - channels: array containing list of channels
  // - channelsData: object with channels' info including ids (twitchId)
  // Returns a promise through Promise.all() which resolves with API data.

  var promises = channels.map(function(channel) {
    return new Promise(function(resolve, reject) {
      var streamsReq = https.request({
        hostname: 'api.twitch.tv',
        path: '/kraken/streams/' + channelsData[channel].twitchId,
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.twitchtv.v5+json',
          'Client-ID': twitchID
        }
      }, function(res) {
        var data = '';
        res.on('data', function(chunk) { data += chunk });
        res.on('end', function() { resolve(JSON.parse(data)); });
      });

      streamsReq.on('error', function(err) {
        console.error('Failed to get stream data: \n', err);
        reject(err);
      });
      streamsReq.end();
    });
  });

  // Returns a promise through Promise.all()
  return Promise.all(promises).then(function(streamData) {
    return streamData;
  }).catch(function(err) {
    console.error('Failed to get stream data: \n', err);
  });
}

function getTwitchData(channels) {
  // Returns returns a promise that when resolved will provide an array of
  // objects containing data for each channel in 'channels'.

  // Get list of channels from database based on user (WIP)
  // ====> ...

  // To make testing easier, we can use a passed in list of channels instead.
  var channels = channels || getChannelList();

  // channelsData is where the data is stored after each round of API calls.
  var channelsData = {};
  channels.forEach(function(channel) { channelsData[channel] = {} });


  // Returns a promise that will ultimatley resolve with the final set
  // of data for all channels in the provided list. Data is assembled after
  // each API call below.
  return getChannelIds(channels).then(function(data) {
    channels.forEach(function(channel, index) {
      channelsData[channel].twitchId = data[index].users.length ? data[index].users[0]._id : null;
      channelsData[channel].closed = data[index]._total ? false : true;
    });

    return getChannelData(channels, channelsData).then(function(data) {
      channels.forEach(function(channel, index) {
        // If channel does not exist
        if (data[index].status === 400 || data[index].status === 404) {
          channelsData[channel].name = channel;
          channelsData[channel].url = null;
          channelsData[channel].logo = 'https://static-cdn.jtvnw.net/jtv_user_pictures/test_channel-profile_image-94a42b3a13c31c02-300x300.png';
          channelsData[channel].followers = 0;
        } else {
          channelsData[channel].name = data[index].display_name;
          channelsData[channel].channelStatus = data[index].status;
          channelsData[channel].url = data[index].url;
          channelsData[channel].logo = data[index].logo || 'https://static-cdn.jtvnw.net/jtv_user_pictures/test_channel-profile_image-94a42b3a13c31c02-300x300.png';
          channelsData[channel].followers = data[index].followers;
        }
      });

      return getStreamData(channels, channelsData).then(function(data) {
        channels.forEach(function(channel, index) {
          // For channels with closed accounts
          if (data[index].status === 400 || data[index].status === 404) {
            channelsData[channel].streaming = null;
            channelsData[channel].streamingDesc = null;
            channelsData[channel].viewers = 0;
            channelsData[channel].streamPreview = null;
          } else if (data[index].stream) {
            // If channel is currently streaming set data
            channelsData[channel].streaming = true
            channelsData[channel].streamDescription = data[index].stream.game;
            channelsData[channel].viewers = data[index].stream.viewers;
            channelsData[channel].streamPreview = data[index].stream.preview.large;
          } else {
            // Channel is not streaming set default data
            channelsData[channel].streaming = false;
            channelsData[channel].streamDescription = 'Offline';
            channelsData[channel].viewers = 0;
            channelsData[channel].streamPreview = null;
          }
        });

        // All data has been assembled at this stage. Transform the data into
        // an array of objects for client-side use.
        var finalData = [];
        channels.forEach(function(channel) { finalData.push(channelsData[channel]) });

        return finalData;
      }).catch(function(err) {
        console.error('Failed to get stream data: \n', err);
      });
    }).catch(function(err) {
      console.error('Error retrieving channel specific data: \n', err);
    });
  }).catch(function(err) {
    console.error('Error retrieving channel IDs: \n', err);
  });
}


// Define route handlers
function GET_channelList(req, res) {
  // Get channels and streaming data from Twitch API
  getTwitchData().then(function(data) {
    res.json(data);
  }).catch(function(err) {
    console.error('There was an error getting data from Twitch API: \n', err);
  });
};


// Expose route handler functions
exports.list = GET_channelList;

// Expose other functions for testing
exports.getChannelList = getChannelList;
exports.getChannelIds = getChannelIds;
exports.getChannelData = getChannelData;
exports.getStreamData = getStreamData;
exports.getTwitchData = getTwitchData;
