gulp = require 'gulp'
$    = do require 'gulp-load-plugins'
argv = require('yargs').argv

ManifestVersionManager = require './ManifestVersionManager'


gulp.task 'update_manifest_version', ->
  manifest = require '../../manifest.json'
  newVersion = new ManifestVersionManager(argv.version, manifest.version).update().getVersion()
  gulp.src './manifest.json'
    .pipe $.jsonEditor version: newVersion
    .pipe gulp.dest './'