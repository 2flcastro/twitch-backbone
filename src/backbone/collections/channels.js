var Backbone = require('backbone');
var ChannelModel = require('../models/channel');

module.exports = Backbone.Collection.extend({
  model: ChannelModel,
  
  url: '/channels/channels-list'
});
