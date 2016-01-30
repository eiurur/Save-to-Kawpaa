gulp = require 'gulp'
$    = do require 'gulp-load-plugins'
exec = require('child_process').exec
path = require 'path'

tag = ->
  return new Promise (resolve, reject) ->
    exec 'git describe --tags --always --dirty', (err, stdout, stderr) ->
      return reject err if err
      tag = stdout.replace(/\n/, '')
      return resolve tag

version = ->
  tag().then (tag) ->
    console.log tag
    console.log tag.replace(/-(\d+)/, '.$1').replace(/-g[0-9a-f]+/, '').replace /-dirty/, ''
    tag.replace(/-(\d+)/, '.$1').replace(/-g[0-9a-f]+/, '').replace /-dirty/, ''

gulp.task 'manifest', ->
  version().then (version) ->
    gulp.src 'manifest.json'
        .pipe($.jsonEditor(version: version))
        .pipe gulp.dest '.'
