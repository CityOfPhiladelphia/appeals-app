/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/detail.html',
    '../models/current-appeal'
], function ($, _, Backbone, Template, CurrentAppeal) {
    'use strict';

    var DetailView = Backbone.View.extend({

      template: _.template(Template),

      title: 'Appeal Details',

      close: function() {
        this.remove();
        this.unbind();
      },

      render: function() {
        this.$el.html(this.template(CurrentAppeal.toJSON()));
        return this;
      }
    });

    return DetailView;
});
