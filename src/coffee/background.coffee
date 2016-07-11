$ ->

  executeScript = (params) ->
    return new Promise (resolve) ->
      chrome.tabs.executeScript null, params, -> return resolve 'ok'

  insertCSS = (params) ->
    return new Promise (resolve) ->
      chrome.tabs.insertCSS null, params, -> return resolve 'ok'

  get = (key) ->
    return new Promise (resolve, reject) ->
      chrome.storage.sync.get key, (item) -> return resolve item[key]

  executeKawpaaScript = (infoStr) ->
    get("token")
    .then (token) ->
      if token is undefined or token is ''
        alert 'トークンが入力されていません。オプションページからトークンを入力してください'
        return

      console.log 'executeKawpaaScript = infoStr = ', infoStr
      tasks = [
        executeScript(file: 'build/js/vendors/lib.min.js')
        insertCSS(file: 'build/css/vendors/lib.min.css')
        executeScript(code: "var info = #{infoStr};")
      ]
      Promise.all tasks
      .then (results) ->
        # chrome.tabs.executeScript null, { file: 'build/js/content.js' }, ->
        chrome.tabs.executeScript null, { file: 'build/js/content.min.js' }, ->
          console.log 'Script injected.'
          return


  ###
  Browser Action
  ###
  chrome.browserAction.onClicked.addListener (tab) -> executeKawpaaScript(null)


  ###
  Shortcut Key
  ###
  chrome.commands.onCommand.addListener (command) -> executeKawpaaScript(null)

  chrome.tabs.onActivated.addListener (tabInfo) ->
    chrome.tabs.get tabInfo.tabId, (tab) ->
      existTokenDOMURL = tab.url is 'https://kawpaa.eiurur.xyz' or tab.url is 'https://kawpaa.eiurur.xyz/account'
      return unless existTokenDOMURL
      executeScript file: 'build/js/retrieveToken.min.js'
      .then (r) -> return

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
  TWEETDECK_HOSTNAME      = 'tweetdeck.twitter.com'
  YANDE_RE_HOSTNAME       = 'yande.re'
  # YOUTUBE_HOSTNAME        = 'www.youtube.com'

  isRequestFromSpecificService = (name) ->
    hostnameList = [DANBOORU_HOSTNAME, GELBOORU_HOSTNAME, KONACHAN_HOSTNAME, PIXIV_HOSTNAME, SANKAKUCOMPLEX_HOSTNAME, TUMBLR_HOSTNAME, TWEETDECK_HOSTNAME, TWITTER_HOSTNAME, YANDE_RE_HOSTNAME]
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

