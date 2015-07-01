$ ->

  ###
  For options.html
  ###

  chrome.storage.sync.get "token", (item) ->
    $("#token").val item.token

  $("#token").bind "keyup", ->
    token = $("#token").val()
    item  = token: token
    chrome.storage.sync.set item, ->
      $('#console').html "#{moment().format('YYYY MMMM Do, h:mm:ss')}: トークンを保存しました"

