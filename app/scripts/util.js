/**
 * Utilities / Helper Functions
 */
define([
    'jquery',
    'underscore',
    'config',
    'nprogress'
], function($, _, Config, NProgress) {
    'use strict';

    var util = {};

    util.liDateRegEx = /\/Date\(([0-9]+)\)\//;

    util.loading = function(status) {
        if(status !== undefined && status) {
          NProgress.start();
        } else {
          NProgress.done();
        }
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
      if (timestamp instanceof Date) {
        var date = new Date(timestamp);
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
      } else {
        var dateString = timestamp.split('-');
        return dateString[1] + '/' + dateString[2] + '/' + dateString[0];
      }
    };

    util.friendlyTime = function(date) {
      var estDate = new Date(date.setHours(date.getHours() + 4));
      var meridiem = (estDate.getHours() < 13) ? 'AM' : 'PM';
      var hour = (estDate.getHours() > 12) ? estDate.getHours() - 12 : estDate.getHours();
      var minutes = (estDate.getMinutes() < 10) ? '0' + estDate.getMinutes() : estDate.getMinutes();
      return (hour + ':' + minutes + ' ' + meridiem);
    };

    util.friendlyLIDate = function(dateString) {
      var date = parseInt(this.liDateRegEx.exec(dateString)[1], 10);
      return this.friendlyDate(new Date(date));
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

    util.friendlyRegionType = function(regionType) {
      if (regionType !== '') {
        return Config.regionMappings[regionType].fullName;
      } else {
        return undefined;
      }
    };

    util.setEndDate = function(date) {
      var startDate = this.fullDate(date);
      return this.queryableDate(new Date(new Date(startDate).setMonth(startDate.getMonth() + Config.defaults.monthsAhead)));
    };

    return util;
});