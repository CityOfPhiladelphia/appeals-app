/*global define*/

define([
    'underscore',
    'backbone',
    '../util',
    '../config'
], function (_, Backbone, Util, Config) {
    'use strict';

    var CurrentAppeal = Backbone.Model.extend({
        defaults: {
          appealNum: 0
        },

        fetchHistory: function() {
          var url = _.template(Config.history.decision, this.toJSON());
        },

        url: function() {
          return _.template(Config.appeal.url, { appealNum: this.get('appealNum') });
        },

        parse: function(resp) {
          if (resp.features.length < 1) {
            return {appealNum: 0};
          } else {
            var data = Util.formatFeature(resp.features[0]);
            return data;
          }
        }
    });

    return new CurrentAppeal();
});