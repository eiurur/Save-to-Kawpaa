gulp = require 'gulp'
$    = do require 'gulp-load-plugins'
path = require 'path'

gulp.task 'zip', [
  'build'
], ->
  manifest = require '../../manifest.json'
  distFileName = "#{manifest.name} v#{manifest.version}.zip"
  console.log distFileName
  gulp.src ['build/**/*', 'manifest.json'], {base: "."}
      .pipe $.zip distFileName
      .pipe gulp.dest 'dist'