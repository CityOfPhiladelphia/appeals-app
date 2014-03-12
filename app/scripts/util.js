/**
 * Utilities / Helper Functions
 */
define([
    'jquery',
    'underscore'
], function($, _) {
    'use strict';

    var util = {};

    util.loading = function(status) {
        $('body').toggleClass('loading', status);
    };

    util.scrollToTop = function() {
        $(window).scrollTop(0);
    };

    /**
     * Converts a YYYY-MM-DD date string into a JavaScript date object
     */
    util.fullDate = function(date) {
      return new Date(date.split('-')[0], date.split('-')[1] - 1, date.split('-')[2]);
    };

    /**
     * Converts a JavaScript Date object into a YYYY-MM-DD string so that it can be used in
     * an ArcGIS REST API query
     */
    util.queryableDate = function(date) {
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    };

    util.friendlyDate = function(timestamp) {
        var date = new Date(timestamp);
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
    };

    util.friendlyTime = function(timestamp) {
      return timestamp.toLocaleTimeString('en-US', { timeZone: 'America/New_York' });
    };

    /**
     * Flattens an ArcGIS feature result for storing as a Backbone model
     */
    util.formatFeature = function(feature) {
      var data = feature.attributes;
      data.lat = feature.geometry.y;
      data.lng = feature.geometry.x;
      data.TIME_SCHEDULED = this.friendlyTime(new Date(data.DATE_SCHEDULED));
      data.DATE_SCHEDULED = this.friendlyDate(new Date(data.DATE_SCHEDULED));
      return data;
    };

    util.formatPolygon = function(feature) {
      var data = feature.attributes;
      data.polygon = feature.geometry;
      return data;
    };

    return util;
});