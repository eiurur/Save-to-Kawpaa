const gulp = require('gulp');
gulp.task('build', [
  'webpack',
  'sass',
  'pug',
  'images',
  'vendor_js',
  'vendor_css',
  'option_css'
]);