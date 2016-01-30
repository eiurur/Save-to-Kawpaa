gulp   = require 'gulp'
bower  = require 'bower'
$      = do require 'gulp-load-plugins'
config = require('../config').bower_options_css

gulp.task 'bower_options_css', ->
  bower.commands.install().on 'end', (installed) ->
    gulp.src config.src
      .pipe $.plumber()
      .pipe $.concat('options.lib.css')
      .pipe gulp.dest config.dest
      .pipe $.rename suffix: '.min'
      .pipe $.cssmin mangle: false
      .pipe gulp.dest config.dest
      .pipe $.notify 'Library op CSS task complete'