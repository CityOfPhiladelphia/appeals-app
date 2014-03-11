/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'leaflet',
    'text!templates/map.html',
    '../models/current-appeal'
], function ($, _, Backbone, L, Template, CurrentAppeal) {
    'use strict';

    var MapView = Backbone.View.extend({

      template: _.template(Template),

      render: function() {
        var map = L.map($('#map')[0]).setView([39.952335, -75.163789], 13);
        L.tileLayer('http://gis.phila.gov/arcgis/rest/services/BaseMaps/GrayBase_WM/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 20,
          minZoom: 11,
          attribution: 'City of Philadelphia'
        }).addTo(map);

        var coords = [CurrentAppeal.get('lat'), CurrentAppeal.get('lng')];

        L.marker(coords).addTo(map);
        // TODO: Get the zoom in to work: map.setView(coords);
        return this;
      }
    });

    return MapView;
});
