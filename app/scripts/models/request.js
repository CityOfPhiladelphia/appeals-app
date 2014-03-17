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
          regionValue: ''
        },

        url: function() {
          var mapping = Config.regionMappings[this.get('regionType')];
          console.log(this.toJSON());
          return [mapping.apiRoot, '/query?where=', mapping.field, '=\'',
                  this.get('regionValue'), '\'&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&returnGeometry=true&outSR=2272&returnIdsOnly=false&returnCountOnly=false&returnZ=false&returnM=false&returnDistinctValues=false&f=json'].join('');
        },

        parse: function(data) {
          console.log('In parse of request model');
          return {geometry: data.features[0].geometry};
        }
    });

    return new RequestModel();
});
