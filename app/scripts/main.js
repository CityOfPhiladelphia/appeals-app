/*global require*/
requirejs.config({
	baseUrl: 'scripts/',
    paths: {
        'jquery': [
            '//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min',
            '../vendor/jquery/jquery'
        ],
        'backbone': [
            '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.0/backbone-min',
            '../vendor/backbone/backbone'
        ],
        'underscore': [
            '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min',
            '../vendor/underscore/underscore'
        ],
        'bootstrap': [
            '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap-wizard/1.0.0/js/bootstrap.min',
            '../vendor/sass-bootstrap/dist/js/bootstrap'
        ],
        'bootstrapSelect': [
            '//cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.3.5/bootstrap-select.min',
            '../vendor/bootstrap-select/bootstrap-select'
        ],
        'bootstrapDatepicker': [
            '//cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.3.0/js/bootstrap-datepicker.min',
            '../vendor/bootstrap-datepicker/js/bootstrap-datepicker'
        ],
        'text': '../vendor/requirejs-text/text',
        'backbonePageable': [
            '//cdnjs.cloudflare.com/ajax/libs/backbone-pageable/1.4.5/backbone-pageable',
            '../vendor/backbone-pageable/lib/backbone-pageable'
        ],
        'leaflet': [
            '//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.2/leaflet',
            '../vendor/leaflet/dist/leaflet'
        ],
        'nprogress': [
            '//cdnjs.cloudflare.com/ajax/libs/nprogress/0.1.2/nprogress.min',
            '../vendor/nprogress/nprogress'
        ]
    },
        shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        bootstrapSelect: {
            deps: ['bootstrap', 'jquery'],
            exports: 'bootstrap-select'
        },
        bootstrapDatepicker: {
            deps: ['bootstrap', 'jquery'],
            exports: 'bootstrap-datepicker'
        },
        backbonePageable: {
            deps: ['backbone'],
            exports: 'backbone-pageable'
        },
        leaflet: {
            deps: ['jquery'],
            exports: 'L'
        },
        nprogress: {
            deps: ['jquery'],
            exports: 'NProgress'
        }

    }
});

require([
    'jquery',
    'backbone',
    'router'
], function ($, Backbone, Router) {
    'use strict';
    /*jshint nonew:false*/
    /**
     * If no CORS support, use jsonp
     */
    Backbone.ajax = function() {
      if( ! $.support.cors && arguments.length) {
        arguments[0].cache = 'true';
        arguments[0].timeout = 15000;
        arguments[0].dataType = 'jsonp';
        return Backbone.$.ajax.apply(Backbone.$, arguments);
      }
      return Backbone.$.ajax.apply(Backbone.$, arguments);
    };

    new Router();
    Backbone.history.start();
});
