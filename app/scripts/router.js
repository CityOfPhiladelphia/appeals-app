/*global define*/

define([
    'jquery',
    'backbone',
    'views/home',
    'views/detail',
    'views/map',
    'models/current-appeal',
    'collections/rcos',
    'bootstrapSelect',
    'bootstrapDatepicker'
], function ($, Backbone, HomeView, DetailView, MapView, CurrentAppeal, RCOCollection) {
    'use strict';

    var router = Backbone.Router.extend({
        routes: {
          'appeals/:appealNum': 'showAppeal',
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
            startDate: 'today',
            endDate: '+6m',
            todayBtn: true,
            autoclose: true,
            todayHighlight: true
          });
          // TODO: scroll to the top
          // TODO: GA log request?
        },

        home: function () {
          var promises = [],
            self = this;

          if (RCOCollection.length <= 0) {
            promises.push(RCOCollection.fetch());
            $.when.apply($, promises)
              .done(function() {
                var homeView = new HomeView();
                self.showView(homeView);
                homeView.onRender();
              })
              .fail(function(xhr) {
                // TODO: Handle failure here
                console.log('Error getting RCOs');
              });
          } else {
            var homeView = new HomeView();
            self.showView(homeView);
            homeView.onRender();
          }
        },

        showAppeal: function(appealNum) {
          var detailView = new DetailView();
          var mapView = new MapView();
          if (CurrentAppeal.get('appealNum') === appealNum) {
            this.showView(detailView);
            mapView.render();
          } else {
            CurrentAppeal.set('appealNum', appealNum);
            var promises = [],
              self = this;
            promises.push(CurrentAppeal.fetch());
            $.when.apply($, promises)
            .done(function() {
              self.showView(detailView);
              mapView.render();
            })
            .fail(function(xhr) {
              // TODO: Handle failure here
              console.log('Error getting appeal details');
            });
          }
        }
    });

    return router;
});
