$ ->



  get = (key) ->
    return new Promise (resolve, reject) ->
      chrome.storage.sync.get key, (item) -> return resolve item[key]

  executeKawpaaScript = (infoStr) ->
    Promise.all [
      get "token"
    ]
    .then (itemList) ->
      token = itemList[0]
      if token is undefined or token is ''
        alert 'トークンが入力されていません。オプションページからトークンを入力してください'
        return
      # info = JSON.parse infoStr
      console.log 'executeKawpaaScript = infoStr = ', infoStr
      chrome.tabs.executeScript null, { file: 'build/js/vendors/lib.min.js' }, ->
        chrome.tabs.insertCSS null, { file: 'build/css/vendors/lib.min.css' }, ->

          # 文字列で渡しても、content.jsではobjectとして受け取る。なので名前もinfo
          chrome.tabs.executeScript null, { code: "var info = #{infoStr};" }, ->

            # chrome.tabs.executeScript null, { file: 'build/js/content.js' }, ->
            chrome.tabs.executeScript null, { file: 'build/js/content.min.js' }, ->
              console.log 'Script injected.'
              return

  ###
  Browser Action
  ###
  # chrome.browserActionはbackgroundでしか動作しねーぞ
  chrome.browserAction.onClicked.addListener (tab) -> executeKawpaaScript(null)


  ###
  Shortcut Key
  ###
  chrome.commands.onCommand.addListener (command) -> executeKawpaaScript(null)


  ###
  Context Menu
  ####
  contexts = [
    'page'
    # 'link'
    'image'
  ]
  contexts.forEach (context) ->
    title = "Save to Kawpaa with #{context}"
    chrome.contextMenus.create
      'title': title
      'contexts': [ context ]
      'id': context

  chrome.contextMenus.create
    'title': 'Open Kawpaa'
    'contexts': ["browser_action"]
    'id': 'browser_action_open_kawpaa'

  clickHandler = (info, tab) ->
    if info.menuItemId is 'browser_action_open_kawpaa'
      KAWPAA_URL = 'https://kawpaa.eiurur.xyz/'
      chrome.tabs.create url: KAWPAA_URL, 'active': true, (tab) -> console.log 'open Kawpaa'
      return
    console.log tab
    console.log info
    infoStr = JSON.stringify info
    executeKawpaaScript(infoStr)

  chrome.contextMenus.onClicked.addListener(clickHandler)


  ###
  Save to Kawpaa button or link
  ###
  # todo: 共通化したい
  DANBOORU_HOSTNAME       = 'danbooru.donmai.us'
  DEVIANTART_HOSTNAME     = 'deviantart.com'
  GELBOORU_HOSTNAME       = 'gelbooru.com'
  KONACHAN_HOSTNAME       = 'konachan.com'
  PIXIV_HOSTNAME          = 'www.pixiv.net'
  SANKAKUCOMPLEX_HOSTNAME = 'chan.sankakucomplex.com'
  TUMBLR_HOSTNAME         = 'www.tumblr.com'
  TWITTER_HOSTNAME        = 'twitter.com'
  YANDE_RE_HOSTNAME       = 'yande.re'

  isRequestFromSpecificService = (name) ->
    hostnameList = [TWITTER_HOSTNAME, DANBOORU_HOSTNAME, GELBOORU_HOSTNAME, KONACHAN_HOSTNAME, PIXIV_HOSTNAME, SANKAKUCOMPLEX_HOSTNAME, TUMBLR_HOSTNAME, YANDE_RE_HOSTNAME]
    return true if name.indexOf(DEVIANTART_HOSTNAME) isnt -1
    return hostnameList.includes(name)

  chrome.runtime.onMessage.addListener (request, sender, sendResponse) ->
    console.log 'onMessage request = ', request
    if request.newIconPath
      console.log 'new Icon Path'
      chrome.browserAction.setIcon
        path: request.newIconPath
        tabId: sender.tab.id
      sendResponse "ok setIcon #{infoStr}"
    else if isRequestFromSpecificService(request.name)
      infoStr = JSON.stringify request.info
      executeKawpaaScript(infoStr)
      sendResponse "ok #{infoStr}"
      return
    else
      sendResponse "ok #{infoStr}"
