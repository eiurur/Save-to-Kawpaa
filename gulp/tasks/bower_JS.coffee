gulp   = require 'gulp'
bower  = require 'bower'
$      = do require 'gulp-load-plugins'
config = require('../config').bower_js

gulp.task 'bower_js', ->
  bower.commands.install().on 'end', (installed) ->
    gulp.src config.src
      .pipe $.plumber()
      .pipe $.concat('lib.js')
      .pipe gulp.dest config.dest
      .pipe $.rename suffix: '.min'
      .pipe $.uglify mangle: false
      .pipe gulp.dest config.dest
      .pipe $.notify 'Library Scripts task complete'
