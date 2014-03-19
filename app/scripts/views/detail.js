/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/detail.html',
    'text!templates/no-decision-history.html',
    '../models/current-appeal',
    '../collections/decisions',
    '../views/decision'
], function ($, _, Backbone, Template, NoDecisionHistoryTemplate, CurrentAppeal, DecisionsCollection, DecisionView) {
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

      addDecision: function(model) {
        var self = this;
        var decisionView = new DecisionView({ model: model});
        $('.decision-history-table').append(decisionView.render().el);
      },

      addDecisions: function(collection) {
        var self = this;
        collection.forEach(function(model) {
          self.addDecision(model);
        });
      },

      displayNoHistoryMessage: function(collection, resp) {
        if (resp.status === 404) {
          $('.decision-history-table').append(_.template(NoDecisionHistoryTemplate));
        }
      },

      onRender: function() {
        var self = this;
        $('#decision-history').one('show.bs.collapse', function(e) {
          e.stopPropagation();
          self.collection = new DecisionsCollection({ appealNum: CurrentAppeal.get('appealNum') });
          self.collection.once('sync', self.addDecisions, self);
          self.collection.once('error', self.displayNoHistoryMessage, self);
          self.collection.fetch({ appealNum: CurrentAppeal.get('appealNum') });
        });
      }
    });

    return DetailView;
});
