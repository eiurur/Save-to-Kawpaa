gulp   = require 'gulp'
bower  = require 'bower'
$      = do require 'gulp-load-plugins'
config = require('../config').bower_css

gulp.task 'bower_css', ->
  bower.commands.install().on 'end', (installed) ->
    gulp.src config.src
      .pipe $.plumber()
      .pipe $.concat('lib.css')
      .pipe gulp.dest config.dest
      .pipe $.rename suffix: '.min'
      .pipe $.cssmin mangle: false
      .pipe gulp.dest config.dest
      .pipe $.notify 'Library CSS task complete'