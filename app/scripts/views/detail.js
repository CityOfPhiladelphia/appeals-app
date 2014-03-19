/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/detail.html',
    'text!templates/no-decision-history.html',
    'text!templates/no-court-history.html',
    '../models/current-appeal',
    '../collections/decisions',
    '../collections/court-histories',
    '../views/decision',
    '../views/court-history'
], function ($, _, Backbone, Template, NoDecisionHistoryTemplate, NoCourtHistoryTemplate,
    CurrentAppeal, DecisionsCollection, CourtHistoriesCollection, DecisionView, CourtHistoryView) {
    'use strict';

    var DetailView = Backbone.View.extend({

      template: _.template(Template),

      title: 'Appeal Details',

      initalize: function() {
        this.views = [];
      },

      close: function() {
        _.each(this.views, function(view) {
          view.close();
        });
        this.remove();
        this.unbind();
      },

      render: function() {
        this.$el.html(this.template(CurrentAppeal.toJSON()));
        return this;
      },

      // TODO: Refactor this eventually
      addDecision: function(model) {
        var self = this;
        var decisionView = new DecisionView({ model: model});
        $('.decision-history-table').append(decisionView.render().el);
      },

      addCourtHistory: function(model) {
        var self = this;
        var courtHistoryView = new CourtHistoryView({ model: model});

        $('.court-history-table').append(courtHistoryView.render().el);
      },

      addDecisions: function(collection) {
        var self = this;
        collection.forEach(function(model) {
          self.addDecision(model);
        });
      },

      addCourtHistories: function(collection) {
        var self = this;
        collection.forEach(function(model) {
          self.addCourtHistory(model);
        });
      },

      displayNoHistoryMessage: function(collection) {
        $('.decision-history-table').append(_.template(NoDecisionHistoryTemplate));
      },

      displayNoCourtHistoryMessage: function(collection) {
        $('.court-history-table').append(_.template(NoCourtHistoryTemplate));
      },

      onRender: function() {
        var self = this;
        $('#decision-history').one('show.bs.collapse', function(e) {
          e.stopPropagation();
          self.decisionsCollection = new DecisionsCollection({ appealId: CurrentAppeal.get('APPEAL_KEY') });
          self.decisionsCollection.once('sync', self.addDecisions, self);
          self.decisionsCollection.once('noDecisions', self.displayNoHistoryMessage, self);
          self.decisionsCollection.fetch();
        });

        $('#court-history').one('show.bs.collapse', function(e) {
          e.stopPropagation();
          self.courtHistoriesCollection = new CourtHistoriesCollection({ appealId: CurrentAppeal.get('APPEAL_KEY') });
          self.courtHistoriesCollection.once('sync', self.addCourtHistories, self);
          self.courtHistoriesCollection.once('noHistory', self.displayNoCourtHistoryMessage, self);
          self.courtHistoriesCollection.fetch();
        });
      }
    });

    return DetailView;
});
