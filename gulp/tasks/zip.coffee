gulp = require 'gulp'
$    = do require 'gulp-load-plugins'
path = require 'path'
argv = require('yargs').argv

ManifestVersionManager = require '../lib/ManifestVersionManager'

gulp.task 'zip', [
  'build'
  'update_manifest_version'
], ->
  manifest = require '../../manifest.json'
  newVersion = new ManifestVersionManager(argv.version, manifest.version).update().getVersion()
  distFileName = "#{manifest.name} v#{newVersion}.zip"
  console.log distFileName
  gulp.src ['build/**/*', 'manifest.json'], {base: "."}
      .pipe $.zip distFileName
      .pipe gulp.dest 'dist'