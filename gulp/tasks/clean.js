const $ = require('gulp-load-plugins')();
const gulp = require('gulp');
const rimraf = require('rimraf');
const config = require("../config").clean;

gulp.task('clean', cb => rimraf(config.target, cb));