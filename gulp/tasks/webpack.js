const $ = require('gulp-load-plugins')();
const path = require("path");
const gulp = require("gulp");
const config = require("../config").webpack;
console.log((process.env.NODE_ENV === 'development'));
const webpackFile = (process.env.NODE_ENV === 'development') ? 'webpack.config.js' : 'webpack.production.config.js';
const webpackConfig =  require(path.resolve(webpackFile));

gulp.task('webpack', () => {
  gulp.src(config.src)
    .pipe($.webpack(webpackConfig))
    .pipe(gulp.dest(config.dest));
});