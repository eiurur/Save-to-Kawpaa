const $ = require('gulp-load-plugins')();
const gulp = require('gulp');
const config = require('../config').pug;

// pug copy
gulp.task('pug', () =>
  gulp.src(config.src)
    .pipe($.plumber())
    .pipe($.pug())
    .pipe(gulp.dest(config.dest))
    .pipe($.notify('pug task complete'))
);