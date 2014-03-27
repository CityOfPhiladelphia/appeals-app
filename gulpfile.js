var gulp = require('gulp'),
  gutil = require('gulp-util')
  sass = require('gulp-ruby-sass'),
  minifyCSS = require('gulp-minify-css'),
  clean = require('gulp-clean'),
  concat = require('gulp-concat'),
  es = require('event-stream'),
  rjs = require('gulp-requirejs'),
  processhtml = require('gulp-processhtml'),
  minifyHTML = require('gulp-minify-html'),
  wrap = require('gulp-wrap-umd'),
  uglify = require('gulp-uglify');

var dirs = {
  dev: './app/',
  prod: './app/build/'
};

gulp.task('umd', function() {
  return es.concat(
    gulp.src([ // Group these together since they have the same wrap params
        dirs.dev + 'vendor/bootstrap-select/bootstrap-select.min.js',
        dirs.dev + 'vendor/bootstrap-datepicker/js/bootstrap-datepicker.js'
    ])
        .pipe(wrap({deps: ['jquery']}))
        .pipe(gulp.dest(dirs.dev + 'vendor/umd')),
    gulp.src(dirs.dev + 'vendor/nprogress/nprogress.js')
        .pipe(wrap({deps: ['jquery'], exports: 'NProgress'}))
        .pipe(gulp.dest(dirs.dev + 'vendor/umd')),
    gulp.src(dirs.dev + 'vendor/leaflet/dist/leaflet.js')
        .pipe(wrap({deps: ['jquery'], exports: 'L'}))
        .pipe(gulp.dest(dirs.dev + 'vendor/umd')),
    gulp.src(dirs.dev + 'vendor/backbone-pageable/lib/backbone-pageable.min.js')
        .pipe(wrap({deps: ['backbone']}))
        .pipe(gulp.dest(dirs.dev + 'vendor/umd'))
  );
});

// Compiles main.scss to CSS, concats all CSS assets and minifies to main.min.css
gulp.task('styles', function() {
  return es.concat(
    gulp.src(dirs.dev + 'styles/main.scss')
      .pipe(sass())
      .pipe(gulp.dest(dirs.dev + 'styles')),
    gulp.src([
      dirs.dev + 'vendor/font-awesome/css/font-awesome.min.css',
      dirs.dev + 'vendor/nprogress/nprogress.css',
      dirs.dev + 'vendor/leaflet/dist/leaflet.css',
      dirs.dev + 'vendor/bootstrap-select/bootstrap-select.min.css',
      dirs.dev + 'vendor/bootstrap-datepicker/css/datepicker3.css',
      dirs.dev + 'styles/main.css',
      dirs.dev + 'styles/philagov.css'
    ])
      .pipe(concat('main.min.css'))
      .pipe(minifyCSS({
        keepSpecialComments: 0,
        removeEmpty: true
      }))
      .pipe(gulp.dest(dirs.prod + 'styles/'))
    )
});

// Compress all JavaScript modules into main.min.js
gulp.task('scripts', function() {
  return rjs({
    name: 'main',
    baseUrl: dirs.dev + 'scripts',
    mainConfigFile: dirs.dev + 'scripts/main.js',
    out: 'main.min.js',
    preserveLicenseComments: false,
    include: ['requireLib'], // Includes require.js in build
        
    paths: {
      'requireLib': '../vendor/requirejs/require', // namespace "require" is reserved
      
      // CDNs
      'jquery': 'empty:',
      'underscore': 'empty:',
      'backbone': 'empty:',
      'bootstrap': 'empty:',
      
      // UMD Wrapped
      'nprogress': '../vendor/umd/nprogress',
      'bootstrapSelect': '../vendor/umd/bootstrap-select.min',
      'bootstrapDatepicker': '../vendor/umd/bootstrap-datepicker',
      'leaflet': '../vendor/umd/leaflet',
      'backbonePageable': '../vendor/umd/backbone-pageable.min',
      'text': '../vendor/requirejs-text/text'
    }
  })
      .pipe(uglify())
      .pipe(gulp.dest(dirs.prod + 'scripts/'));
});

// Copies all images to build/ directory
gulp.task('images', function() {
  return gulp.src(dirs.dev + 'images/**/*')
    .pipe(gulp.dest(dirs.prod + 'images'));
});

// Copies all of the vendor/ directory to the build for JS fallback
gulp.task('vendor', function() {
   return gulp.src(dirs.dev + 'vendor/**/*')
    .pipe(gulp.dest(dirs.prod + 'vendor'));
});

// Change index.html asset references to build ones
// Minify HTML
gulp.task('html', function() {
  return gulp.src(dirs.dev + 'index.html')
    .pipe(processhtml('index.html'))
    //.pipe(minifyHTML())
    .pipe(gulp.dest(dirs.prod));
});

// Empty the build/ directory besides git stuff
gulp.task('clean', function() {
  return gulp.src([
    dirs.prod + '**/*',
    '!' + dirs.prod + '.git',
    '!' + dirs.prod + 'CNAME'
    ], {read: false})
      .pipe(clean());
});

gulp.task('default', ['clean', 'umd'], function() {
  gulp.start('styles', 'scripts', 'images', 'vendor', 'html');
});