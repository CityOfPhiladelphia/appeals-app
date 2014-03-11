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
        apiRoot: 'http://gis.phila.gov/arcgis/rest/services/PhilaGov/ServiceAreas/MapServer/2',
        field: 'DIST_NUM'
      },
      rco: {
        apiRoot: 'http://gis.phila.gov/arcgis/rest/services/PhilaGov/RCO/MapServer/0',
        field: 'ORG_NAME'
      },
      planning: {
        url: 'http://gis.phila.gov/arcgis/rest/services/PhilaGov/ServiceAreas/MapServer/21',
        field: 'DIST_NAME'
      }
    };

    return config;
});