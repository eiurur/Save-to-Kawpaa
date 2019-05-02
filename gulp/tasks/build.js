const gulp = require('gulp');
gulp.task('build', [
  'sass',
  'pug',
  'images',
  'vendor_js',
  'vendor_css',
  'option_css',
]);
