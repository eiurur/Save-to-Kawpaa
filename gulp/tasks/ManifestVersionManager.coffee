module.exports = class MenifestVersionManager
  constructor: (@versionType, @version) ->

  update: ->
    v = @version.split('.')
    switch @versionType
      when 'major' then v[0] = (v[0] - 0) + 1
      when 'minor' then v[1] = (v[1] - 0) + 1
      when 'patch' then v[2] = (v[2] - 0) + 1
      else break
    @version = v.join('.')
    return @

  getVersion: -> @version