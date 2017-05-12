var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
  defaults: {
    title: '',
    accountClosed: false,
    channelUrl: '',
    profileImg: '',
    followers: 0,
    streaming: false,
    streamDesc: 'Offline',
    viewers: 0,
    streamPreview: '',
  }
});
