var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var config = require('../config').vendor_css;

gulp.task('vendor_css', function () {
  return gulp
    .src(config.src)
    .pipe($.plumber())
    .pipe($.concat('lib.css'))
    .pipe(gulp.dest(config.dest))
    .pipe($.rename({ suffix: '.min' }))
    .pipe($.cleanCss({ mangle: false }))
    .pipe(gulp.dest(config.dest))
    .pipe($.notify('Library CSS task complete'));
});
