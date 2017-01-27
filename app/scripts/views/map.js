/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'leaflet',
    '../config',
    // Templates
    'text!templates/map.html',
    // Models    
    '../models/current-appeal'
], function ($, _, Backbone, L, Config, Template, CurrentAppeal) {
    'use strict';

    var MapView = Backbone.View.extend({

      template: _.template(Template),

      render: function() {
        var coords = [CurrentAppeal.get('lat'), CurrentAppeal.get('lng')];
        var map = L.map($('#map')[0]).setView(coords, 18);
        L.tileLayer(Config.basemap.basemap, {
          maxZoom: 18,
          minZoom: 11,
          attribution: 'City of Philadelphia'
        }).addTo(map);
        
        L.tileLayer(Config.basemap.labels, {
          maxZoom: 18,
          minZoom: 11,
          attribution: 'City of Philadelphia'
        }).addTo(map);

        L.marker(coords).addTo(map);
        map.setMaxBounds([
          [39.88023492849342, -75.29548645019531],
          [40.15211239398205, -75.29548645019531],
          [40.15211239398205, -74.88967895507812],
          [39.88023492849342, -74.88967895507812]]);

        return this;
      },

      close: function() {
        this.remove();
        this.unbind();
      }
    });

    return MapView;
});
