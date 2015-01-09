
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
        field: 'ORGANIZATION_NAME'
      },
      planning: {
        fullName: 'Planning District',
        apiRoot: 'http://gis.phila.gov/arcgis/rest/services/PhilaGov/ServiceAreas/MapServer/20',
        field: 'DIST_NAME'
      }
    };

    config.rcoList = {
      url: 'http://gis.phila.gov/arcgis/rest/services/PhilaGov/RCO/MapServer/0/query?where=1%3D1&outFields=ORGANIZATION_NAME&returnGeometry=true&returnIdsOnly=false&returnCountOnly=false&orderByFields=ORGANIZATION_NAME&returnZ=false&returnM=false&returnDistinctValues=false&f=pjson'
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
      court: 'http://api.phila.gov/li/v1/zbacourtdetails?$filter=appeal_id eq <%= appealId %>&$format=json',
      decision: 'http://api.phila.gov/li/v1/zbahearingdecisions?$filter=appeal_id eq <%= appealId %>&$format=json'
    };

    return config;
});
