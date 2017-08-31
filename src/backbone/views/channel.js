var $ = require('jquery');
var Backbone = require('backbone');
var Handlebars = require('handlebars');
var fs = require('fs');

var template = fs.readFileSync(__dirname + '/../templates/channel.hbs', { encoding: 'utf8' });


module.exports = Backbone.View.extend({
  className: 'channel-container',

  template: Handlebars.compile(template),

  initialize: function() {
    this.listenTo(this.model, 'toggleFilterVisible', this.toggleFilterVisible);
    this.listenTo(this.model, 'toggleMatchVisible', this.toggleMatchVisible);
    this.listenTo(this.model, 'destroy', this.remove);
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  toggleFilterVisible: function(filter) {
    // Toggle the view's visibiliy based on filtered query
    var isStreaming = this.model.get('streaming');
    var isHidden = (filter === 'offline' && isStreaming) || (filter === 'streaming' && !isStreaming);
    this.$el.toggleClass('u-hidden', isHidden);
  },

  // Toggle the view's visibility based wether a match was found
  toggleMatchVisible: function(match) {
    this.$el.toggleClass('u-hidden', !match);
  }
});
