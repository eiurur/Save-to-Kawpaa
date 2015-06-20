gulp   = require 'gulp'
$      = do require 'gulp-load-plugins'
rimraf = require 'rimraf'
config = require('../config').clean

gulp.task 'clean', (cb) ->
  rimraf config.target, cb