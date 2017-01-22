let $    = require('gulp-load-plugins')();
const gulp = require("gulp");
const config = require("../config").images;

// images copy
gulp.task('images', () =>
  gulp.src(config.src)
    .pipe($.plumber())
    .pipe(gulp.dest(config.dest))
    .pipe($.notify('images task complete'))
);