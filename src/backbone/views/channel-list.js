var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Handlebars = require('handlebars');
var fs = require('fs');

var template = fs.readFileSync(__dirname + '/../templates/channel-list.hbs', { encoding: 'utf8' });

var ChannelView = require('./channel');
var ChannelModel = require('../models/channel');
var ChannelsCollection = require('../collections/channels');

module.exports = Backbone.View.extend({
  className: 'channels',

  template: Handlebars.compile(template),

  events: {
    'click .filter-choice-all': function() { this.filterChannels('all'); },
    'click .filter-choice-streaming': function() { this.filterChannels('streaming'); },
    'click .filter-choice-offline': function() { this.filterChannels('offline'); },
    'click .search-btn': 'searchChannels',
    'keyup .search-bar': 'searchChannels'
  },

  initialize: function() {
    // Set collection
    this.collection = new ChannelsCollection();

    // Set event listeners
    this.listenTo(this.collection, 'add', this.addChannel);
  },

  render: function() {
    this.$el.html(this.template());

    // Sticky Search/Filter Nav
    var searchFilterNav = this.$el.find('.search-filter-nav');
    var channelsList = this.$el.find('.channels-list');
    var offsetTop = searchFilterNav.offset().top || 63; // Determine y-offset of nav from document

    $(window).scroll(function() {
      if ($(window).scrollTop() > offsetTop) {
        searchFilterNav.addClass('search-filter-nav--sticky');
        channelsList.css('margin-top', offsetTop); // Add margin-top based on nav offset
      } else {
        searchFilterNav.removeClass('search-filter-nav--sticky');
        channelsList.css('margin-top', '0px');
      }
    });

    this.collection.fetch();

    return this;
  },

  addChannel: function(channel) {
    var channelView = new ChannelView({ model: channel });
    this.$el.find('.channels-list').append(channelView.render().el);
  },

  filterChannels: function(filter) {
    this.collection.forEach(function(channel) {
      channel.trigger('toggleFilterVisible', filter);
    });
    $('body').animate({ scrollTop: 0 }, 300);
    this.$el.find('.filter-choice--active').removeClass('filter-choice--active');
    this.$el.find('.filter-choice-' + filter).addClass('filter-choice--active');
    this.$el.find('.search-results').hide();
  },

  searchChannels: function() {
    var searchQuery = this.$el.find('.search-bar').val().toLowerCase().trim();
    var re = new RegExp(searchQuery, 'g');
    var numMatches = 0;

    this.collection.forEach(function(channel) {
      var match = channel.get('name').toLowerCase().match(re);
      channel.trigger('toggleMatchVisible', match);
      if (match) { numMatches++ }
    });

    // Display search results block
    $('body').animate({ scrollTop: 0 }, 300);
    var channelsTxt = numMatches === 1 ? ' channel ' : ' channels ';
    var searchResultsEl = this.$el.find('.search-results'); // Reference search results DOM element
    searchResultsEl.fadeIn().find('h3').html(numMatches + channelsTxt+ 'found:');
    if (searchQuery === '') { searchResultsEl.hide(); }
  }
});
