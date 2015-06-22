gulp = require 'gulp'
gulp.task 'build', [
  'bower_js'
  'bower_css'
  'bower_font'
  'coffee'
  'sass'
  'jade'
  'images_copy'
]