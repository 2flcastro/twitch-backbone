var $ = require('jquery'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars'),
    fs = require('fs');

var template = fs.readFileSync(__dirname + '/../templates/channel.hbs', { encoding: 'utf8' });


module.exports = Backbone.View.extend({
  className: 'channel-container',

  template: Handlebars.compile(template),

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});
