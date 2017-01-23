let $    = require('gulp-load-plugins')();
const { exec } = require('child_process');
const gulp = require("gulp");
const path = require("path");
const watch = require("gulp-watch");
// const { config } = require("../config");


var tag = () =>
  new Promise((resolve, reject) =>
    exec('git describe --tags --always --dirty', function(err, stdout, stderr) {
      if (err) { return reject(err); }
      tag = stdout.replace(/\n/, '');
      return resolve(tag);
    })
  )
;

let version = () =>
  tag().then(function(tag) {
    console.log(tag);
    console.log(tag.replace(/-(\d+)/, '.$1').replace(/-g[0-9a-f]+/, '').replace(/-dirty/, ''));
    return tag.replace(/-(\d+)/, '.$1').replace(/-g[0-9a-f]+/, '').replace(/-dirty/, '');
  })
;

gulp.task('manifest', () =>
  version().then(version =>
    gulp.src('manifest.json')
        .pipe($.jsonEditor({version}))
        .pipe(gulp.dest('.'))
  )
);
