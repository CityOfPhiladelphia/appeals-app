/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    '../util',
    '../config',
    // Views
    '../views/appeal',
    '../views/summary',
    // Templates
    'text!templates/home.html',
    // Models
    '../models/request',
    // Collections
    '../collections/appeals',
    '../collections/rcos'
], function ($, _, Backbone, Util, Config, AppealView, SummaryView, Template, Request, Appeals, RCOs) {
    'use strict';

    var AppView = Backbone.View.extend({

        template: _.template(Template),

        initialize: function(options) {
          this.collection = new Appeals({mode: 'client'});
          this.summaryView = new SummaryView();
          this.listenTo(this.collection.fullCollection, 'reset', this.resetAppeals);
          this.listenTo(this.collection, 'reset', this.checkPageCount);
          this.listenTo(this.collection, 'request', function() { Util.loading(true); });
          this.listenTo(this.collection, 'sync',function() { Util.loading(false); });
          this.listenTo(this.collection, 'error', function() { Util.loading(false); });
          this.page = 1;
          var opts = options || {};
          var startDate = opts.startDate || Util.queryableDate(new Date());
          var endDate = opts.endDate || Util.setEndDate(startDate);
          var regionType = opts.regionType || '';
          var regionValue = opts.regionValue || '';
          Request.set('startDate', startDate);
          Request.set('endDate', endDate);
          Request.set('regionType', regionType);
          Request.set('regionValue', regionValue);
          this.listenTo(Request, 'change:geometry', this.fetchData);
          this.views = [];
          if (Request.get('regionType') !== '' && Request.get('regionValue') !== '' && Request.get('geometry') !== '') {
            this.fetchData();
          }

          if (Request.get('regionType') === '' && Request.get('regionValue') === '') {
            this.fetchData();
          }

        },

        events: {
          'click .btn-more': 'paginate',
          'change .region-picker': 'filterByRegion'
        },

        fetchData: function() {
          this.params = _.extend({}, Config.request.params, {where: 'DATE_SCHEDULED>=date\'' + Request.get('startDate') + '\' and DATE_SCHEDULED<=DATE\'' + Request.get('endDate') + '\''});
          this.reqType = 'GET';
          if (Request.get('geometry') !== '') {
            this.params = _.extend(this.params, {
                geometryType: 'esriGeometryPolygon',
                geometry: JSON.stringify({
                  rings: [Request.get('geometry').rings[0]],
                  spatialReference: {wkid: 2272}
                }),
                spatialRel: 'esriSpatialRelContains'});
            this.reqType = 'POST';
          }
          this.collection.fetch({ data: this.params, type: this.reqType });
        },

        checkPageCount: function(collection) {
          if (collection.state.currentPage === collection.state.totalPages || collection.state.totalPages === null) {
            $('.btn-more').hide();
          } else {
            if (!$('.btn-more').is(':visible')) {
              $('.btn-more').show();
            }
          }
        },

        setEndDate: function(date) {
          var startDate = Util.fullDate(date);
          return Util.queryableDate(new Date(new Date(startDate).setMonth(startDate.getMonth() + 6)));
        },

        render: function() {
          var rcos = RCOs.toJSON();
          this.$el.html(this.template({rcos: rcos}));
          return this;
        },

        onRender: function() {
          var self = this;

          $('.input-daterange .start-date')[0].value = Util.friendlyDate(Request.get('startDate'));
          $('.input-daterange .end-date')[0].value = Util.friendlyDate(Request.get('endDate'));

          if (Request.get('regionType')) {
            $('.region-picker').selectpicker('val', Request.get('regionType') + ':' + Request.get('regionValue'));
          }

          $('.input-daterange .start-date').datepicker()
            .on('changeDate', function(e) {
              Request.set('startDate', Util.queryableDate(e.date));
              self.fetchData();
          });
          $('.input-daterange .end-date').datepicker()
            .on('changeDate', function(e) {
              Request.set('endDate', Util.queryableDate(e.date));
              self.fetchData();
          });
        },

        addOne: function(model) {
          var appealView = new AppealView({ model: model });
          $('.appeals-table').append(appealView.render().el);
          this.views.push(appealView);
        },

        resetAppeals: function(collection) {
          this.page = 1;
          _.each(this.views, function(view) {
            view.close();
          });
          this.addAppeals(this.collection.getFirstPage());
          this.page = this.page + 1;
          this.checkPageCount(this.collection);

          $('#results-summary').empty().append(this.summaryView.render({
            count: collection.length,
            startDate: Util.friendlyDate(Request.get('startDate')),
            endDate: Util.friendlyDate(Request.get('endDate')),
            regionType: Util.friendlyRegionType(Request.get('regionType')),
            regionValue: Request.get('regionValue') || undefined
          }));
          this.route = '/filter/' + Request.get('startDate') + '/' + Request.get('endDate');
          if (Request.get('regionType') !== '') {
            this.route = this.route + '/' + Request.get('regionType') + '/' + Request.get('regionValue');
          }

          Backbone.history.navigate(this.route);
        },

        addAppeals: function(collection) {
          var self = this;
          collection.forEach(function(model) {
            self.addOne(model);
          });
        },

        paginate: function(e) {
          e.stopPropagation();
          this.addAppeals(this.collection.getPage(this.page));
          this.page = this.page + 1;
        },

        getGeometry: function() {
          if (Request.get('regionValue') !== '') {
            Request.fetch();
          } else {
            this.fetchData();
          }
        },

        filterByRegion: function(e) {
          e.stopPropagation();
          if ($('.region-picker').val() === 'all') {
            Request.set('regionType', '');
            Request.set('regionValue', '');
            Request.set('geometry', '');
          } else {
            Request.set('regionType', $('.region-picker').val().split(':')[0]);
            Request.set('regionValue', $('.region-picker').val().split(':')[1]);
            this.getGeometry();
          }
        },

        close: function() {
          _.each(this.views, function(view) {
            view.close();
          });
          this.undelegateEvents();
          this.remove();
          this.unbind();
        }
    });

    return AppView;
});
