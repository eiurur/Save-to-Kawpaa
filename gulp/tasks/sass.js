const $ = require('gulp-load-plugins')();
const gulp = require("gulp");
const sass = require("gulp-sass");
const config = require("../config").sass;

gulp.task("sass", () =>
  gulp.src(config.src)
    .pipe($.plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(config.dest))
    .pipe($.rename({suffix: '.min'}))
    .pipe($.cssmin())
    .pipe(gulp.dest(config.dest))
    .pipe($.notify('CSS task complete'))
);
