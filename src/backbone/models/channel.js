var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
  defaults: {
    twitchId: null,
    name: '',
    closed: false,
    url: '',
    logo: '',
    followers: 0,
    streaming: false,
    streamDescription: 'Offline',
    viewers: 0,
    streamPreview: '',
  },

  idAttribute: '_id'
});
