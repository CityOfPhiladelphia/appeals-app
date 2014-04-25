/*global define*/

define([
    'underscore',
    'backbone',
    '../util',
    // Models
    'models/rco'
], function (_, Backbone, Util, RcoModel) {
    'use strict';

    var RcosCollection = Backbone.Collection.extend({
        model: RcoModel,

        url: 'http://gis.phila.gov/arcgis/rest/services/PhilaGov/RCO/MapServer/0/query?where=1%3D1&outFields=ORG_NAME&returnGeometry=true&returnIdsOnly=false&returnCountOnly=false&orderByFields=ORG_NAME&returnZ=false&returnM=false&returnDistinctValues=false&f=pjson',

        parse: function(data) {
          return _.map(data.features, function(feature) {
            Util.formatPolygon(feature);
            return feature.attributes;
          });
        }
    });

    return new RcosCollection();
});
