/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/home.html',
    '../collections/appeals',
    '../views/appeal',
    '../collections/rcos',
    '../models/request'
], function ($, _, Backbone, Template, Appeals, AppealView, RCOs, Request) {
    'use strict';

    var AppView = Backbone.View.extend({

        template: _.template(Template),

        initialize: function() {
          this.collection = new Appeals();
          this.collection.on('reset', this.resetAppeals, this);
          Request.on('change:geometry', this.getFilteredAppeals, this);
          this.collection.fetch({data: {
            f: 'json',
            orderByFields: 'DATE_SCHEDULED',
            outFields: 'VIOLATION_ADDRESS,TYPE,APPEAL_NUM,PERMIT_NO,GROUNDS,PRIMARY_APPLICANT,DATE_SCHEDULED,APPEAL_KEY',
            outSR: 4326,
            returnGeometry: true,
            where: 'DATE_SCHEDULED>=date\'2014-03-05\''
          }});
          this.views = [];
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
          this.addAppeals(collection);
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
            where: 'DATE_SCHEDULED>=date\'2014-03-05\''
          },
          type: 'POST'});
        },

        paginate: function(e) {
          e.stopPropagation();
          var nextAppeals = this.collection.getNextPage();
          this.addAppeals(this.collection.getNextPage());
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
