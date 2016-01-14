gulp   = require 'gulp'
bower  = require 'bower'
$      = do require 'gulp-load-plugins'
config = require('../config').bower_options_js

gulp.task 'bower_options_js', ->
  bower.commands.install().on 'end', (installed) ->
    gulp.src config.src
      .pipe $.plumber()
      .pipe $.concat('options.lib.js')
      .pipe gulp.dest config.dest
      .pipe $.rename suffix: '.min'
      .pipe $.uglify mangle: false
      .pipe gulp.dest config.dest
      .pipe $.notify 'Library op Scripts task complete'
