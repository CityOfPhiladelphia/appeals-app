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
          console.log('In fetchHistory of current appeal');
          var url = _.template(Config.history.decision, this.toJSON());
          console.log(url);
          //$.ajax
        },

        url: function() {
          return _.template(Config.appeal.url, { appealNum: this.get('appealNum') });
        },

        parse: function(resp) {
          var data = Util.formatFeature(resp.features[0]);
          return data;
        }
    });

    return new CurrentAppeal();
});