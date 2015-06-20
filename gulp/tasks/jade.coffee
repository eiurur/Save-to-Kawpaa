gulp   = require 'gulp'
$      = do require 'gulp-load-plugins'
config = require('../config').jade

# jade copy
gulp.task 'jade', ->
  gulp.src config.src
    .pipe $.plumber()
    .pipe $.jade()
    .pipe gulp.dest config.dest
    .pipe $.notify 'jade task complete'