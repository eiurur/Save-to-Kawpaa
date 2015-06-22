$ ->

  # ingo
  executeOnaItLaterScript = (infoStr) ->

    # これってここか？
    keys = [ 'token' ]
    chrome.storage.sync.get keys, (item) ->

      console.log item

      if item.token is undefined
        alert 'optionページからトークンを入力してください'
        return

      console.log item.token

      chrome.tabs.executeScript null, { file: 'build/js/vendors/lib.js' }, ->

        chrome.tabs.insertCSS null, { file: 'build/css/vendors/lib.css' }, ->

          # 文字列で渡しても、content.jsではobjectとして受け取る。なので名前もinfo
          chrome.tabs.executeScript null, { code: "var info = #{infoStr};" }, ->

            chrome.tabs.executeScript null, { file: 'build/js/content.js' }, ->
              console.log 'Script injected.'
              return

  ###
  Browser Action
  ###
  # chrome.browserActionはbackgroundでしか動作しねーぞ
  chrome.browserAction.onClicked.addListener (tab) ->
    executeOnaItLaterScript(null)


  ###
  Context Menu
  ####
  clickHandler = (info, tab) ->
    console.log info
    infoStr = JSON.stringify info
    console.log infoStr
    executeOnaItLaterScript(infoStr)

  chrome.contextMenus.create
    'title': 'Save to Ona it Later'
    'contexts': [ 'image' ]
    'id': 'image'

  chrome.contextMenus.onClicked.addListener(clickHandler)