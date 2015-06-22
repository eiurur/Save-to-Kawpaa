$ ->

  ###
  For options.html
  ###

  chrome.storage.sync.get "token", (item) ->
    token = item.token
    # showBlogName token
    $("#token").val token
    # showTumblrPost token  if token isnt "undefined"

  $("#token").bind "keyup", ->
    token = $("#token").val()
    item = token: token
    chrome.storage.sync.set item, ->

      # TODO: Ajaxで問い合わせて、存在したらok、なければngをメッセージで出力
      $('#console').html "#{moment().format('YYYY MMMM Do, h:mm:ss')}: トークンを保存しました"

