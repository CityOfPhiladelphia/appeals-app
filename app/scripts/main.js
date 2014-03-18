/*global require*/
require.config({
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
        }
    },
    paths: {
        jquery: '../vendor/jquery/jquery',
        backbone: '../vendor/backbone/backbone',
        underscore: '../vendor/underscore/underscore',
        bootstrap: '../vendor/sass-bootstrap/dist/js/bootstrap',
        bootstrapSelect: '../vendor/bootstrap-select/bootstrap-select',
        bootstrapDatepicker: '../vendor/bootstrap-datepicker/js/bootstrap-datepicker',
        text: '../vendor/requirejs-text/text',
        backbonePageable: '../vendor/backbone-pageable/lib/backbone-pageable',
        leaflet: 'http://cdn.leafletjs.com/leaflet-0.7.2/leaflet'
    }
});

require([
    'jquery',
    'backbone',
    'router',
    'views/home',
    'bootstrap',
    'leaflet'
], function ($, Backbone, Router, HomeView) {
    'use strict';
    /*jshint nonew:false*/
    new Router();
    Backbone.history.start();
});
