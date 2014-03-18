/*global define*/

define([
    'underscore',
    'backbone',
    'models/decision',
    '../config'
], function (_, Backbone, DecisionModel, Config) {
    'use strict';

    var AppealsCollection = Backbone.Collection.extend({
        model: DecisionModel,

        initialize: function(options) {
          this.appealNum = options.appealNum;
        },

        url: function() {
          return _.template(Config.history.decision, {appealNum: this.appealNum});
        },

        parse: function(data) {
          // TODO: Parse the date
          return data.d;
        }
    });

    return AppealsCollection;
});
