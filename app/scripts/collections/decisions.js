/*global define*/

define([
    'underscore',
    'backbone',
    '../config',
    '../util',
    // Models
    'models/decision'
], function (_, Backbone, Config, Util, DecisionModel) {
    'use strict';

    var DecisionsCollection = Backbone.Collection.extend({
        model: DecisionModel,

        initialize: function(options) {
          this.appealId = options.appealId;
        },

        url: function() {
          return _.template(Config.history.decision, {appealId: this.appealId});
        },

        parse: function(data) {
          if (data.d.results.length < 1) {
            this.trigger('noDecisions', {status: 404});
          } else {
          return _.map(data.d.results, function(entry) {
            /*jshint camelcase: false */
            entry.decision_datetime = Util.friendlyLIDate(entry.decision_datetime);
            return entry;
          });
          }
        }
    });

    return DecisionsCollection;
});
