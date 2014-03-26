/*global require*/
require.config({
		baseUrl: 'scripts/',
    paths: {
        jquery: '../vendor/jquery/jquery',
        backbone: '../vendor/backbone/backbone',
        underscore: '../vendor/underscore/underscore',
        bootstrap: '../vendor/sass-bootstrap/dist/js/bootstrap',
        bootstrapSelect: '../vendor/bootstrap-select/bootstrap-select',
        bootstrapDatepicker: '../vendor/bootstrap-datepicker/js/bootstrap-datepicker',
        text: '../vendor/requirejs-text/text',
        backbonePageable: '../vendor/backbone-pageable/lib/backbone-pageable',
        leaflet: 'http://cdn.leafletjs.com/leaflet-0.7.2/leaflet',
        nprogress: '../vendor/nprogress/nprogress'
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
            exports: 'Nprogress'
        }

    }
});

require([
    'jquery',
    'backbone',
    'router',
    'views/home',
    'bootstrap',
    'leaflet'
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
