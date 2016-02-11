$ ->

  ###
  For options.html
  ###
  chrome.storage.sync.get "token", (item) ->
    $("#token").val item.token

  $("#token").on "keyup", ->
    token = $("#token").val()
    item  = token: token
    chrome.storage.sync.set item, ->
      $('#console').html "#{moment().format('YYYY MMMM Do, h:mm:ss')}: トークンを保存しました"


  ###
  Pixiv
  ###
  chrome.storage.sync.get 'pixiv_username', (item) ->
    $('#pixiv_username').val item.pixiv_username

  chrome.storage.sync.get 'pixiv_password', (item) ->
    $('#pixiv_password').val item.pixiv_password

  $("#pixiv_username").on "keyup", ->
    pixiv_username = $("#pixiv_username").val()
    pixivUsernameItem = pixiv_username: pixiv_username
    chrome.storage.sync.set pixivUsernameItem, ->
      $('#console').html "#{moment().format('YYYY MMMM Do, h:mm:ss')}: pixivのデータを保存しました"

  $("#pixiv_password").on "keyup", ->
    pixiv_password = $("#pixiv_password").val()
    pixivPasswordItem = pixiv_password: pixiv_password
    chrome.storage.sync.set pixivPasswordItem, ->
      $('#console').html "#{moment().format('YYYY MMMM Do, h:mm:ss')}: pixivのデータを保存しました"

