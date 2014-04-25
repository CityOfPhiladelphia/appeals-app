/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    // Templates
    'text!templates/summary.html'
], function ($, _, Backbone, Template) {
    'use strict';

    var SummaryView = Backbone.View.extend({
      template: _.template(Template),

      render: function(appealsData) {
        this.$el.html(this.template(appealsData));
        return this.el;
      }
    });

    return SummaryView;
});
