module.exports = class MenifestVersionManager
  constructor: (@versionType, @version) ->

  update: ->
    v = @version.split('.')
    switch @versionType
      when 'major'
        v[0] = (v[0] - 0) + 1
        v[1] = 0
        v[2] = 0
      when 'minor'
        v[1] = (v[1] - 0) + 1
        v[2] = 0
      when 'patch'
         v[2] = (v[2] - 0) + 1
      else break
    @version = v.join('.')
    return @

  getVersion: -> @version