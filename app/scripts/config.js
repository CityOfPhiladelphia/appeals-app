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
        apiRoot: 'http://gis.phila.gov/arcgis/rest/services/PhilaGov/ServiceAreas/MapServer/20',
        field: 'DIST_NAME'
      }
    };

    config.basemap = {
      url: 'http://gis.phila.gov/arcgis/rest/services/BaseMaps/Hybrid_WM/MapServer/tile/{z}/{y}/{x}'
    };

    config.appeal = {
      /*jshint quotmark:double */
      url: "http://gis.phila.gov/arcgis/rest/services/PhilaGov/Construction/MapServer/5/query?f=json&returnIdsOnly=false&returnCountOnly=false&outFields=VIOLATION_ADDRESS,TYPE,APPEAL_NUM,PERMIT_NO,GROUNDS,PRIMARY_APPLICANT,DATE_SCHEDULED,APPEAL_KEY&&where=APPEAL_NUM='<%= appealNum %>'&outSR=4326&returnGeometry=true"
    };

    /*jshint quotmark:single */
    config.request = {
      params: {
        f: 'json',
        orderByFields: 'DATE_SCHEDULED',
        outFields: 'VIOLATION_ADDRESS,TYPE,APPEAL_NUM,PERMIT_NO,GROUNDS,PRIMARY_APPLICANT,DATE_SCHEDULED,APPEAL_KEY',
        outSR: 4326,
        returnGeometry: true
      }
    };

    config.defaults = {
      monthsAhead: 6
    };

    config.history = {
      court: 'http://services.phila.gov/PhillyAPI/Data/v1.0/zbacourtdetails?$filter=appeal_id eq <%= appealId %>&$format=json',
      decision: 'http://services.phila.gov/PhillyAPI/Data/v1.0/zbahearingdecisions?$filter=appeal_id eq <%= appealId %>&$format=json'
    };

    return config;
});