/*global define*/

define([
    'underscore',
    'backbone',
    '../config',
    '../util',
    // Models
    'models/court-history'
], function (_, Backbone, Config, Util, CourtHistoryModel) {
    'use strict';

    var CourtHistoriesCollection = Backbone.Collection.extend({
        model: CourtHistoryModel,

        initialize: function(options) {
          this.appealId = options.appealId;
        },

        url: function() {
          return _.template(Config.history.court, {appealId: this.appealId});
        },

        parse: function(data) {
          if (data.d.results.length < 1) {
            this.trigger('noHistory', {status: 404});
          } else {
          return _.map(data.d.results, function(entry) {
            /*jshint camelcase: false */
            entry.court_action_datetime = Util.friendlyLIDate(entry.court_action_datetime);
            return entry;
          });
          }
        }
    });

    return CourtHistoriesCollection;
});
