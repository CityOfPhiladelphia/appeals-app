/*global define*/

define([
    'underscore',
    'backbone',
    'models/court-history',
    '../config'
], function (_, Backbone, CourtHistoryModel, Config) {
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
          // TODO: Parse the date
          if (data.d.results.length < 1) {
            this.trigger('noHistory', {status: 404});
          } else {
          return data.d.results;
          }
        }
    });

    return CourtHistoriesCollection;
});
