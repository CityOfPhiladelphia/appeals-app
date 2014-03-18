/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/decision.html'
], function ($, _, Backbone, Template) {
    'use strict';

    var DecisionView = Backbone.View.extend({
        template: _.template(Template),

        tagName: 'tr',

        initialize: function(options) {
          this.model = options.model;
          this.render();
        },

        close: function() {
          this.remove();
          this.unbind();
        },

        render: function() {
          this.$el.html(this.template(this.model.toJSON()));
          return this;
        }
    });

    return DecisionView;
});
