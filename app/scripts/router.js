/*global define*/

define([
    'jquery',
    'backbone',
    'config',
    'util',
    // Views
    'views/home',
    'views/detail',
    'views/map',
    'views/not-found-appeal',
    'views/api-down',
    // Models
    'models/current-appeal',
    // Collections
    'collections/rcos',
    // Vendor   
    'bootstrapSelect',
    'bootstrapDatepicker'
], function ($, Backbone, Config, Util, HomeView, DetailView, MapView, NotFoundView, ApiDownView, CurrentAppeal,
     RCOCollection) {
    'use strict';

    var router = Backbone.Router.extend({
        routes: {
          'appeals/:appealNum': 'showAppeal',
          'filter/:startDate/:endDate(/:regionType/:regionValue)': 'filter',
          '*path': 'home'
        },

        showView: function(view) {
          if (this.currentView) {
            this.currentView.close();
          }
          $('#app').empty().append(view.render().el);
          document.title = view.title !== undefined && view.title ? view.title : $('title').text();
          this.currentView = view;
          $('.selectpicker').selectpicker();
          $('.input-daterange').datepicker({
            format: 'mm/dd/yyyy',
            startDate: '-30d',
            endDate: '+' + Config.defaults.monthsAhead + 'm',
            todayBtn: true,
            autoclose: true,
            todayHighlight: true
          });
          // TODO: GA log request?
        },

        home: function(options) {
          var promises = [],
            self = this,
            opts = options || {};

          if (RCOCollection.length <= 0) {
            Util.loading(true);
            promises.push(RCOCollection.fetch());
            $.when.apply($, promises)
              .always(function() {
                var homeView = new HomeView(opts);
                self.showView(homeView);
                homeView.onRender();
                Util.loading(false);
              })
              .fail(function() {
                // TODO: Log ajax error in GA
              });
          } else {
            var homeView = new HomeView(opts);
            self.showView(homeView);
            homeView.onRender();
          }
        },

        filter: function(startDate, endDate, regionType, regionValue) {
          var options = {};
          options.startDate = startDate;
          options.endDate = endDate;
          options.regionType = regionType || undefined;
          options.regionValue = regionValue || undefined;
          this.home(options);
        },

        showAppeal: function(appealNum) {
          var detailView = new DetailView();
          var mapView = new MapView();
          if (CurrentAppeal.get('appealNum') === appealNum) {
            this.showView(detailView);
            detailView.onRender();
            mapView.render();
          } else {
            CurrentAppeal.set('appealNum', appealNum);
            var promises = [],
              self = this;
            Util.loading(true);
            promises.push(CurrentAppeal.fetch());
            $.when.apply($, promises)
              .done(function() {
                if (CurrentAppeal.get('appealNum') === appealNum) {
                  self.showView(detailView);
                  detailView.onRender();
                  mapView.render();
                  Util.loading(false);
                } else {
                  // TODO: Log error in GA
                  self.showAppealNotFound();
                  Util.loading(false);
                }
            })
            .fail(function(xhr) {
              // TODO: Log error in GA
              self.showApiDown();
              Util.loading(false);
            });
          }
        },

        showAppealNotFound: function() {
          var notFoundView = new NotFoundView();
          this.showView(notFoundView);
        },

        showApiDown: function() {
          var apiDownView = new ApiDownView();
          this.showView(apiDownView);
        }
    });

    return router;
});
