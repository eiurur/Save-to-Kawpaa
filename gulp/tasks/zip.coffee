gulp = require 'gulp'
$    = do require 'gulp-load-plugins'
path = require 'path'

gulp.task 'zip', [
  'coffee'
  'jade'
  'sass'
  'sass'
], ->
  manifest = require '../../manifest.json'
  distFileName = "#{manifest.name} v#{manifest.version}.zip"
  console.log distFileName
  gulp.src ['build/**/*', 'bower_components/**/*', 'manifest.json'], {base: "."}
      .pipe $.zip distFileName
      .pipe gulp.dest 'dist'