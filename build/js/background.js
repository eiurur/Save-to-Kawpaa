$(function() {
  var clickHandler, contexts, executeOnaItLaterScript;
  executeOnaItLaterScript = function(infoStr) {
    return chrome.storage.sync.get(['token'], function(item) {
      if (item.token === void 0 || item.token === '') {
        alert('トークンが入力されていません。オプションページからトークンを入力してください');
        return;
      }
      return chrome.tabs.executeScript(null, {
        file: 'bower_components/jquery/dist/jquery.min.js'
      }, function() {
        return chrome.tabs.executeScript(null, {
          file: 'bower_components/alertify.js/lib/alertify.min.js'
        }, function() {
          return chrome.tabs.insertCSS(null, {
            file: 'bower_components/alertify.js/themes/alertify.core.css'
          }, function() {
            return chrome.tabs.insertCSS(null, {
              file: 'bower_components/alertify.js/themes/alertify.default.css'
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
      });
    });
  };

  /*
  Browser Action
   */
  chrome.browserAction.onClicked.addListener(function(tab) {
    return executeOnaItLaterScript(null);
  });

  /*
  Context Menu
   */
  clickHandler = function(info, tab) {
    var KAWPAA_URL, infoStr;
    if (info.menuItemId === 'browser_action') {
      KAWPAA_URL = 'https://kawpaa.eiurur.xyz/';
      chrome.tabs.create({
        url: KAWPAA_URL,
        'active': true
      }, function(tab) {
        return console.log('Go to Kawpaa');
      });
      return;
    }
    console.log(tab);
    console.log('Context Menu =====> ');
    console.log(info);
    infoStr = JSON.stringify(info);
    console.log(infoStr);
    return executeOnaItLaterScript(infoStr);
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
    'title': 'Go to Kawpaa',
    'contexts': ["browser_action"],
    'id': 'browser_action'
  });
  chrome.contextMenus.onClicked.addListener(clickHandler);

  /*
  Icon
   */
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var infoStr;
    if (request.name === 'twitter') {
      infoStr = JSON.stringify(request.info);
      console.log(infoStr);
      executeOnaItLaterScript(infoStr);
      sendResponse('ok');
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
    return executeOnaItLaterScript(null);
  });
});
