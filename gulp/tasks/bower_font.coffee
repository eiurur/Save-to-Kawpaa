gulp   = require 'gulp'
bower  = require 'bower'
$      = do require 'gulp-load-plugins'
config = require('../config').bower_font

gulp.task 'bower_font', ->
  bower.commands.install().on 'end', (installed) ->
    gulp.src config.src
      .pipe $.plumber()
      .pipe gulp.dest config.dest
      .pipe $.notify 'fonts task complete'