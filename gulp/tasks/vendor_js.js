const gulp   = require('gulp');
const $      = require('gulp-load-plugins')();
const config = require('../config').vendor_js;

gulp.task('vendor_js', function() {
  return gulp.src(config.src)
    .pipe($.plumber())
    .pipe($.concat('lib.js'))
    .pipe(gulp.dest(config.dest))
    .pipe($.rename({suffix: '.min'}))
    .pipe($.uglify({mangle: false}))
    .pipe(gulp.dest(config.dest))
    .pipe($.notify('Library Scripts task complete'));
});
