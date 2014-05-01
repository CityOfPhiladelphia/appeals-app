/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    // Templates
    'text!templates/appeal.html',
    // Models
    '../models/current-appeal'
], function ($, _, Backbone, Template, CurrentAppeal) {
    'use strict';

    var AppealView = Backbone.View.extend({
        template: _.template(Template),

        tagName: 'tr',

        className: 'appeal-row',

        initialize: function(options) {
          this.model = options.model;
          this.render();
        },

        events: {
          'click': 'showAppealDetails'
        },

        showAppealDetails: function(e) {
          e.stopPropagation();
          var appealNum = this.model.get('APPEAL_NUM');
          CurrentAppeal.set('appealNum', appealNum);
          CurrentAppeal.set(this.model.toJSON());
          Backbone.history.navigate('/appeals/' + this.model.get('APPEAL_NUM'), { trigger: true });
        },

        close: function() {
          this.undelegateEvents();
          this.remove();
          this.unbind();
        },

        render: function() {
          this.delegateEvents();
          this.$el.html(this.template(this.model.toJSON()));
          return this;
        }
    });

    return AppealView;
});
