/*global define*/

define([
    'underscore',
    'backbone',
    '../util'
], function (_, Backbone, Util) {
    'use strict';

    var CurrentAppeal = Backbone.Model.extend({
        defaults: {
          appealNum: 0
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