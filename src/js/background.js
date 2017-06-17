const { targets } = require("./lib/config");
const BrowserIconClickListener = require("./lib/BrowserIconClickListener");
const ShortcutListener = require("./lib/ShortcutListener");
const KawpaaScriptExecuter = require("./lib/KawpaaScriptExecuter");
const ChromeExecuter = require("./lib/ChromeExecuter");
const ContextMenuExtensionListener = require("./lib/ContextMenuExtensionListener");
const RuntimeMessageListener = require("./lib/RuntimeMessageListener");

[
  new ShortcutListener(),
  new BrowserIconClickListener(),
  new ContextMenuExtensionListener(),
  new RuntimeMessageListener()
].map(listener => listener.activate());

/**
 * Kawpaaからtokenをスクレイピング
 */
chrome.tabs.onActivated.addListener(tabInfo => {
  chrome.tabs.get(tabInfo.tabId, tab => {
    let existTokenDOMURL =
      tab.url === "https://kawpaa.eiurur.xyz" ||
      tab.url === "https://kawpaa.eiurur.xyz/account";
    if (!existTokenDOMURL) {
      return;
    }
    ChromeExecuter.executeScript({
      file: `build/js/retrieveToken.bundle.js`
    }).then(res => console.log(res));
  });
});
