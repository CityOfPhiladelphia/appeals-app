/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    // Templates
    'text!templates/api-down.html'
], function ($, _, Backbone, Template) {
    'use strict';

    var NotFoundAppealView = Backbone.View.extend({
        template: _.template(Template),

        tagName: 'div',

        close: function() {
          this.remove();
          this.unbind();
        },

        render: function() {
          this.$el.html(this.template());
          return this;
        }
    });

    return NotFoundAppealView;
});
