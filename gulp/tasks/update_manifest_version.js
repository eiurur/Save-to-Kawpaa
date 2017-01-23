const $ = require('gulp-load-plugins')();
const gulp = require('gulp');
const { argv } = require('yargs');

const ManifestVersionManager = require('../lib/ManifestVersionManager');
const manifest = require('../../manifest.json');
const newVersion = new ManifestVersionManager(argv.version, manifest.version).update().getVersion();

gulp.task('update_manifest_version', function() {
  return gulp.src('./manifest.json')
    .pipe($.jsonEditor({version: newVersion}))
    .pipe(gulp.dest('./'));
});