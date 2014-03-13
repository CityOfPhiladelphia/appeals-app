/**
 * Config / Data Mappings
 */
define([
    'jquery',
    'underscore'
], function($, _) {
    'use strict';

    var config = {};

    config.regionMappings = {
      cd: {
        fullName: 'Council District',
        apiRoot: 'http://gis.phila.gov/arcgis/rest/services/PhilaGov/ServiceAreas/MapServer/2',
        field: 'DIST_NUM'
      },
      rco: {
        fullName: 'Registered Community Organization',
        apiRoot: 'http://gis.phila.gov/arcgis/rest/services/PhilaGov/RCO/MapServer/0',
        field: 'ORG_NAME'
      },
      planning: {
        fullName: 'Planning District',
        apiRoot: 'http://gis.phila.gov/arcgis/rest/services/PhilaGov/ServiceAreas/MapServer/21',
        field: 'DIST_NAME'
      }
    };

    config.basemap = {
      url: 'http://gis.phila.gov/arcgis/rest/services/BaseMaps/Hybrid_WM/MapServer/tile/{z}/{y}/{x}'
    };

    return config;
});