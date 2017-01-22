const gulp   = require('gulp');
const $      = require('gulp-load-plugins')();
const config = require('../config').option_css;

gulp.task('option_css', function() {
  return gulp.src(config.src)
    .pipe($.plumber())
    .pipe($.concat('options.lib.css'))
    .pipe(gulp.dest(config.dest))
    .pipe($.rename({suffix: '.min'}))
    .pipe($.cssmin({mangle: false}))
    .pipe(gulp.dest(config.dest))
    .pipe($.notify('Library op CSS task complete'));
});