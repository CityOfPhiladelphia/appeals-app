/*global define*/

define([
    'underscore',
    'backbone',
    '../config'
], function (_, Backbone, Config) {
    'use strict';

    var RequestModel = Backbone.Model.extend({
        defaults: {
          regionType: '',
          regionValue: '',
          geometry: ''
        },

        url: function() {
          var mapping = Config.regionMappings[this.get('regionType')];
          return [mapping.apiRoot, '/query?where=', mapping.field, '=\'',
                  this.get('regionValue'), '\'&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&returnGeometry=true&outSR=2272&returnIdsOnly=false&returnCountOnly=false&returnZ=false&returnM=false&returnDistinctValues=false&f=json'].join('');
        },

        parse: function(data) {
          return {geometry: data.features[0].geometry};
        }
    });

    return new RequestModel();
});
