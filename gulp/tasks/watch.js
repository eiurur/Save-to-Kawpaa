const gulp = require("gulp");
const watch = require("gulp-watch");
const config = require("../config").watch;

gulp.task("watch", () => {
  watch(config.webpack, () => gulp.start(["webpack"]));
  watch(config.pug, () => gulp.start(["pug"]));
  watch(config.sass, () => gulp.start(["sass"]));
  watch(config.images, () => gulp.start(["images"]))
});
