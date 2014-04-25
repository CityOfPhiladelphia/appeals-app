/*global define*/

define([
    'underscore',
    'backbone',
    '../util',
    '../config',
    // Models
    'models/rco'
], function (_, Backbone, Util, Config, RcoModel) {
    'use strict';

    var RcosCollection = Backbone.Collection.extend({
        model: RcoModel,

        url: Config.rcoList.url,

        parse: function(data) {
          return _.map(data.features, function(feature) {
            Util.formatPolygon(feature);
            return feature.attributes;
          });
        }
    });

    return new RcosCollection();
});
