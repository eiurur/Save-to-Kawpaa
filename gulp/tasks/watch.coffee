gulp   = require("gulp")
watch  = require("gulp-watch")
config = require("../config").watch

gulp.task "watch", ->

  # coffee
  watch config.coffee, ->
    gulp.start ["coffee"]

  # jade
  watch config.jade, ->
    gulp.start ["jade"]

  # sass
  watch config.sass, ->
    gulp.start ["sass"]

  # images_copy
  watch config.images_copy, ->
    gulp.start ["images_copy"]
