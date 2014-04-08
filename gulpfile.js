var gulp = require('gulp'),
  gutil = require('gulp-util')
  sass = require('gulp-sass'),
  minifyCSS = require('gulp-minify-css'),
  clean = require('gulp-clean'),
  concat = require('gulp-concat'),
  es = require('event-stream'),
  rjs = require('gulp-requirejs'),
  processhtml = require('gulp-processhtml'),
  minifyHTML = require('gulp-minify-html'),
  wrap = require('gulp-wrap-umd'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  gulpFilter = require('gulp-filter');

var htmlFilter = gulpFilter('!**/**/*.html');
var mdFilter = gulpFilter('!**/**/*.md');
var lessFilter = gulpFilter('!**/**/*.less');
var scssFilter = gulpFilter('!**/**/*.less');

var dirs = {
  dev: './app/',
  prod: './app/build/'
};

gulp.task('umd', function() {
  return gulp.src([
      dirs.dev + 'vendor/bootstrap-select/bootstrap-select.min.js',
      dirs.dev + 'vendor/bootstrap-datepicker/js/bootstrap-datepicker.js'
    ])
      .pipe(wrap({deps: ['jquery']}))
      .pipe(gulp.dest(dirs.dev + 'vendor/umd'));
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
      'requireLib': '../vendor/requirejs/require',

      // CDNs
      'jquery': 'empty:',
      'underscore': 'empty:',
      'backbone': 'empty:',
      'bootstrap': 'empty:',
      'bootstrapSelect': 'empty:',
      'bootstrapDatepicker': 'empty:',
      'backbonePageable': 'empty:',
      'leaflet': 'empty:',
      'nprogress': 'empty:'
    }
  })
      .pipe(uglify())
      .pipe(gulp.dest(dirs.prod + 'scripts/'));
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
      dirs.dev + 'styles/philagov.css',
      dirs.dev + 'styles/main.css'
    ])
      .pipe(concat('main.min.css'))
      .pipe(minifyCSS({
        keepSpecialComments: 0,
        removeEmpty: true
      }))
      .pipe(gulp.dest(dirs.prod + 'styles/'))
    )
});

gulp.task('ie', function() {
  return gulp.src(dirs.prod + 'styles/main.ie.css')
    .pipe(minifyCSS({
      keepSpecialComments: 0,
      removeEmpty: true
    }))
    .pipe(rename('main.ie.min.css'))
    .pipe(gulp.dest(dirs.prod + 'styles/'))
});

// Copies all images to build/ directory
gulp.task('images', function() {
  return gulp.src(dirs.dev + 'images/**/*')
    .pipe(gulp.dest(dirs.prod + 'images'));
});

// Copies all of the vendor/ directory to build/
gulp.task('vendor', function() {
   return gulp.src(dirs.dev + 'vendor/**/*')
    .pipe(htmlFilter)
    .pipe(mdFilter)
    .pipe(lessFilter)
    .pipe(scssFilter)
    .pipe(gulp.dest(dirs.prod + 'vendor'));
});

// Copies all of the fonts/ directory to fonts/
gulp.task('fonts', function() {
   return gulp.src(dirs.dev + 'fonts/**/*')
    .pipe(gulp.dest(dirs.prod + 'fonts'));
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
  gulp.start('styles', 'scripts', 'images', 'fonts', 'vendor', 'html');
});
