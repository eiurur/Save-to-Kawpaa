const {targets} = require('./lib/config');
const KawpaaScriptExecuter = require('./lib/KawpaaScriptExecuter');
const ChromeExecuter = require('./lib/ChromeExecuter');
const ContextMenuExtension = require('./lib/ContextMenuExtension');

/**
 * アイコンクリック
 */
chrome.browserAction.onClicked.addListener( (tab) => new KawpaaScriptExecuter(null).execute() )

/**
 * ショートカットキー
 */
chrome.commands.onCommand.addListener( (command) => new KawpaaScriptExecuter(null).execute() )

/**
 * Kawpaaからtokenをスクレイピング
 */
chrome.tabs.onActivated.addListener( (tabInfo) => {
  chrome.tabs.get( (tabInfo.tabId), (tab) => {
      let existTokenDOMURL = (tab.url === 'https://kawpaa.eiurur.xyz') || (tab.url === 'https://kawpaa.eiurur.xyz/account');
      if (!existTokenDOMURL) { return; }
      ChromeExecuter.executeScript({file: `build/js/retrieveToken.${FILE_TYPE}js`}).then((res) => console.log(res) );
  })
})

/**
 * コンテキストメニュー
 */
const contextMennu = new ContextMenuExtension();
chrome.contextMenus.onClicked.addListener(contextMennu.onClick)

/**
 * メッセージング
 */
chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
  var infoStr;

  console.log('onMessage request = ', request);

  if (request.newIconPath) {
    console.log('new Icon Path');
    chrome.browserAction.setIcon({
      path: request.newIconPath,
      tabId: sender.tab.id
    });
    return sendResponse(`ok setIcon ${infoStr}`);
  }

  if (isRequestFromSpecificService(request.name)) {
    infoStr = JSON.stringify(request.info);
    new KawpaaScriptExecuter(infoStr).execute();
    sendResponse(`ok ${infoStr}`);
    return;
  }

  return sendResponse(`ok ${infoStr}`);
});

function isRequestFromSpecificService(hostname) {
  var hostnameList = Object.values(targets);
  if (hostname.indexOf(targets.DEVIANTART_HOSTNAME) !== -1) { return true; }
  return hostnameList.includes(hostname);
};
