$(function() {
  var clickHandler, executeOnaItLaterScript;
  executeOnaItLaterScript = function(infoStr) {
    var keys;
    keys = ['token'];
    return chrome.storage.sync.get(keys, function(item) {
      console.log(item);
      if (item.token === void 0) {
        alert('optionページからトークンを入力してください');
        return;
      }
      console.log(item.token);
      return chrome.tabs.executeScript(null, {
        file: 'build/js/vendors/lib.js'
      }, function() {
        return chrome.tabs.insertCSS(null, {
          file: 'build/css/vendors/lib.css'
        }, function() {
          return chrome.tabs.executeScript(null, {
            code: "var info = " + infoStr + ";"
          }, function() {
            return chrome.tabs.executeScript(null, {
              file: 'build/js/content.js'
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
    return executeOnaItLaterScript(null);
  });

  /*
  Context Menu
   */
  clickHandler = function(info, tab) {
    var infoStr;
    console.log(info);
    infoStr = JSON.stringify(info);
    console.log(infoStr);
    return executeOnaItLaterScript(infoStr);
  };
  chrome.contextMenus.create({
    'title': 'Save to Ona it Later',
    'contexts': ['image'],
    'id': 'image'
  });
  return chrome.contextMenus.onClicked.addListener(clickHandler);
});
