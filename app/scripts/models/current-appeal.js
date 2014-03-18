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
          return "http://gis.phila.gov/arcgis/rest/services/PhilaGov/Construction/MapServer/5/query?f=json&returnIdsOnly=false&returnCountOnly=false&outFields=VIOLATION_ADDRESS,TYPE,APPEAL_NUM,PERMIT_NO,GROUNDS,PRIMARY_APPLICANT,DATE_SCHEDULED,APPEAL_KEY&&where=APPEAL_NUM='" + this.get('appealNum') + "'&outSR=4326&returnGeometry=true";
        },

        parse: function(resp) {
          var data = Util.formatFeature(resp.features[0]);
          return data;
        }
    });

    return new CurrentAppeal();
});