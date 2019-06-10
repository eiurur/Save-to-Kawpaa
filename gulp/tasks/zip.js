let $ = require('gulp-load-plugins')();
const path = require('path');
const { argv } = require('yargs');
const gulp = require('gulp');
const watch = require('gulp-watch');

const ManifestVersionManager = require('../lib/ManifestVersionManager');

gulp.task(
  'zip',
  gulp.series('update_manifest_version', function() {
    let manifest = require('../../manifest.json');
    let newVersion = new ManifestVersionManager(argv.versions, manifest.version)
      .update()
      .getVersion();
    let distFileName = `${manifest.name} v${newVersion}.zip`;
    console.log(distFileName);
    return gulp
      .src(['build/**/*', 'manifest.json'], { base: '.' })
      .pipe($.zip(distFileName))
      .pipe(gulp.dest('dist'));
  }),
);
