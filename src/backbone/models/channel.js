var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
  defaults: {
    twitchId: 0,
    name: '...',
    closed: false,
    url: '...',
    logo: '...',
    followers: 0,
    streaming: false,
    streamDescription: 'Offline',
    viewers: 0,
    streamPreview: '...',
  },

  idAttribute: '_id',

  validate: function(attrs, options) {
    if (typeof attrs.twitchId !== 'number' || attrs.twitchId < 0) {
      return 'Invalid: Channel twitchId must be a positive number';
    } else if (typeof attrs.name !== 'string' || attrs.name.length < 1) {
      return 'Invalid: Channel name must be a string and at least one character long';
    } else if (typeof attrs.closed !== 'boolean') {
      return 'Invalid: Channel closed property should have a boolean value';
    } else if (typeof attrs.url !== 'string' || attrs.url.length < 1) {
      return 'Invalid: Channel url should be a string and at least one character long';
    } else if (typeof attrs.logo !== 'string' || attrs.url.length < 1) {
      return 'Invalid: Channel logo should be a string and at least one character long';
    } else if (typeof attrs.followers !== 'number' || attrs.followers < 0) {
      return 'Invalid: Channel followers should be a positive number';
    } else if (typeof attrs.streaming !== 'boolean') {
      return 'Invalid: Channel streaming property should have a boolean value';
    } else if (typeof attrs.streamDescription !== 'string' || attrs.streamDescription.length < 1) {
      return 'Invalid: Channel streamDescription should be a string and at least one character long';
    } else if (typeof attrs.viewers !== 'number') {
      return 'Invalid: Channel viewers should be a number';
    } else if (typeof attrs.streamPreview !== 'string' || attrs.streamPreview.length < 1) {
      return 'Invalid: Channel streamPreview should be a string and at least one character long';
    }
  }
});
