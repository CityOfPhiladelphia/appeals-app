/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/home.html',
    '../collections/appeals',
    '../views/appeal',
    '../collections/rcos',
    '../models/request',
    '../util'
], function ($, _, Backbone, Template, Appeals, AppealView, RCOs, Request, Util) {
    'use strict';

    var AppView = Backbone.View.extend({

        template: _.template(Template),

        initialize: function(options) {
          this.collection = new Appeals({mode: 'client'});
          this.collection.fullCollection.on('reset', this.resetAppeals, this);
          this.collection.on('reset', this.checkPageCount, this);
          this.page = 1;

          var opts = options || {};
          var startDate = opts.startDate || Util.queryableDate(new Date());
          var endDate = opts.endDate || this.setEndDate(startDate);
          Request.set('startDate', startDate);
          Request.set('endDate', endDate);
          Request.on('change:geometry', this.getFilteredAppeals, this);
          this.collection.fetch({data: {
            f: 'json',
            orderByFields: 'DATE_SCHEDULED',
            outFields: 'VIOLATION_ADDRESS,TYPE,APPEAL_NUM,PERMIT_NO,GROUNDS,PRIMARY_APPLICANT,DATE_SCHEDULED,APPEAL_KEY',
            outSR: 4326,
            returnGeometry: true,
            where: 'DATE_SCHEDULED>=date\'' + Request.get('startDate') + '\' and DATE_SCHEDULED<=DATE\'' + Request.get('endDate') + '\''
          }});
          this.views = [];
        },

        checkPageCount: function(collection) {
          if (collection.state.currentPage === collection.state.totalPages) {
            $('.btn-more').hide();
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

        events: {
          'click .btn-more': 'paginate',
          'change .region-picker': 'filterByRegion'
        },

        addOne: function(model) {
          var appealView = new AppealView({ model: model });
          $('.appeals-table').append(appealView.render().el);
          this.views.push(appealView);
        },

        resetAppeals: function(collection) {
          _.each(this.views, function(view) {
            view.close();
          });
          this.addAppeals(this.collection.getFirstPage());
          this.page = this.page + 1;
        },

        addAppeals: function(collection) {
          var self = this;
          collection.forEach(function(model) {
            self.addOne(model);
          });
        },

        getFilteredAppeals: function(model) {
          this.collection.fetch({data: {
            geometryType: 'esriGeometryPolygon',
            geometry: JSON.stringify({
              rings: [model.get('geometry').rings[0]],
              spatialReference: {wkid: 2272}
            }),
            spatialRel: 'esriSpatialRelContains',
            f: 'json',
            orderByFields: 'DATE_SCHEDULED',
            outFields: 'VIOLATION_ADDRESS,TYPE,APPEAL_NUM,PERMIT_NO,GROUNDS,PRIMARY_APPLICANT,DATE_SCHEDULED,APPEAL_KEY',
            inSR: 2272,
            outSR: 4326,
            returnGeometry: true,
            where: 'DATE_SCHEDULED>=date\'' + Request.get('startDate') + '\' and DATE_SCHEDULED<=DATE\'' + Request.get('endDate') + '\''
          },
          type: 'POST'});
        },

        paginate: function(e) {
          e.stopPropagation();
          this.addAppeals(this.collection.getPage(this.page));
          this.page = this.page + 1;
        },

        filterByRegion: function(e) {
          e.stopPropagation();
          Request.set('regionType', $('.region-picker').val().split(':')[0]);
          Request.set('regionValue', $('.region-picker').val().split(':')[1]);
          Request.fetch();
        },

        close: function() {
          _.each(this.views, function(view) {
            view.close();
          });
          this.remove();
          this.unbind();
        }
    });

    return AppView;
});
