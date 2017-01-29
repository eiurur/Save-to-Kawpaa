const $ = require('gulp-load-plugins')();
const gulp = require('gulp');
const { argv } = require('yargs');

const ManifestVersionManager = require('../lib/ManifestVersionManager');

gulp.task('update_manifest_version', function() {
  const manifest = require('../../manifest.json');
  const newVersion = new ManifestVersionManager(argv.version, manifest.version).update().getVersion();
  return gulp.src('./manifest.json')
    .pipe($.jsonEditor({version: newVersion}))
    .pipe(gulp.dest('./'));
});