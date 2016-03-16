$(function() {
  var DANBOORU_HOSTNAME, DEVIANTART_HOSTNAME, GELBOORU_HOSTNAME, KONACHAN_HOSTNAME, PIXIV_HOSTNAME, SANKAKUCOMPLEX_HOSTNAME, TWITTER_HOSTNAME, YANDE_RE_HOSTNAME, clickHandler, contexts, executeKawpaaScript, get, isRequestFromSpecificService;
  get = function(key) {
    return new Promise(function(resolve, reject) {
      return chrome.storage.sync.get(key, function(item) {
        return resolve(item[key]);
      });
    });
  };
  executeKawpaaScript = function(infoStr) {
    return Promise.all([get("token")]).then(function(itemList) {
      var token;
      token = itemList[0];
      if (token === void 0 || token === '') {
        alert('トークンが入力されていません。オプションページからトークンを入力してください');
        return;
      }
      console.log('executeKawpaaScript = infoStr = ', infoStr);
      return chrome.tabs.executeScript(null, {
        file: 'build/js/vendors/lib.min.js'
      }, function() {
        return chrome.tabs.insertCSS(null, {
          file: 'build/css/vendors/lib.min.css'
        }, function() {
          return chrome.tabs.executeScript(null, {
            code: "var info = " + infoStr + ";"
          }, function() {
            return chrome.tabs.executeScript(null, {
              file: 'build/js/content.min.js'
            }, function() {
              console.log('Script injected.');
            });
          });
        });
      });
    });
  };

  /*
  Browser Action
   */
  chrome.browserAction.onClicked.addListener(function(tab) {
    return executeKawpaaScript(null);
  });

  /*
  Context Menu
   */
  clickHandler = function(info, tab) {
    var KAWPAA_URL, infoStr;
    if (info.menuItemId === 'browser_action_open_kawpaa') {
      KAWPAA_URL = 'https://kawpaa.eiurur.xyz/';
      chrome.tabs.create({
        url: KAWPAA_URL,
        'active': true
      }, function(tab) {
        return console.log('open Kawpaa');
      });
      return;
    }
    console.log(tab);
    console.log('Context Menu =====> ');
    console.log(info);
    infoStr = JSON.stringify(info);
    console.log(infoStr);
    return executeKawpaaScript(infoStr);
  };
  contexts = ['page', 'image'];
  contexts.forEach(function(context) {
    var title;
    title = "Save to Kawpaa with " + context;
    return chrome.contextMenus.create({
      'title': title,
      'contexts': [context],
      'id': context
    });
  });
  chrome.contextMenus.create({
    'title': 'Open Kawpaa',
    'contexts': ["browser_action"],
    'id': 'browser_action_open_kawpaa'
  });
  chrome.contextMenus.onClicked.addListener(clickHandler);
  DANBOORU_HOSTNAME = 'danbooru.donmai.us';
  DEVIANTART_HOSTNAME = 'deviantart.com';
  GELBOORU_HOSTNAME = 'gelbooru.com';
  KONACHAN_HOSTNAME = 'konachan.com';
  PIXIV_HOSTNAME = 'www.pixiv.net';
  SANKAKUCOMPLEX_HOSTNAME = 'chan.sankakucomplex.com';
  TWITTER_HOSTNAME = 'twitter.com';
  YANDE_RE_HOSTNAME = 'yande.re';
  isRequestFromSpecificService = function(name) {
    var hostnameList;
    hostnameList = ['twitter', DANBOORU_HOSTNAME, GELBOORU_HOSTNAME, KONACHAN_HOSTNAME, PIXIV_HOSTNAME, SANKAKUCOMPLEX_HOSTNAME, YANDE_RE_HOSTNAME];
    if (name.indexOf(DEVIANTART_HOSTNAME) !== -1) {
      return true;
    }
    return hostnameList.includes(name);
  };
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var infoStr;
    if (isRequestFromSpecificService(request.name)) {
      infoStr = JSON.stringify(request.info);
      executeKawpaaScript(infoStr);
      sendResponse("ok " + infoStr);
      return;
    }
    return chrome.browserAction.setIcon({
      path: request.newIconPath,
      tabId: sender.tab.id
    });
  });

  /*
  Shortcut Key
   */
  return chrome.commands.onCommand.addListener(function(command) {
    console.log(command);
    return executeKawpaaScript(null);
  });
});
