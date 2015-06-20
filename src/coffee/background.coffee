$ ->

  # chrome.browserActionはbackgroundでしか動作しねーぞ
  chrome.browserAction.onClicked.addListener (tab) ->

    # 開発用
    url = 'http://127.0.0.1:9021/api/posts'

    keys = [ 'token' ]
    chrome.storage.sync.get keys, (item) ->

      console.log item

      if item.token is undefined
        console.log 'token is undefined'
        return

      console.log item.token

      $.ajax
        type: "POST"
        url: url
        data:
          token: item.token
        headers:
          "Access-Control-Allow-Origin": "*"
      .done (data) ->
        console.log data
      .fail (err) ->
        console.log err
