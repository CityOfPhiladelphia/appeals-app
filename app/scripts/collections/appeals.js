/*global define*/

define([
    'underscore',
    'backbone',
    '../util',
    // Models
    'models/appeal',
    // Vendor
    'backbonePageable'
], function (_, Backbone, Util, AppealsModel) {
    'use strict';

    var AppealsCollection = Backbone.PageableCollection.extend({
        model: AppealsModel,

        mode: 'client',

        url: 'http://gis.phila.gov/arcgis/rest/services/PhilaGov/Construction/MapServer/5/query',

        parse: function(data) {
          return _.map(data.features, function(feature) {
            Util.formatFeature(feature);
            return feature.attributes;
          });
        }
    });

    return AppealsCollection;
});
