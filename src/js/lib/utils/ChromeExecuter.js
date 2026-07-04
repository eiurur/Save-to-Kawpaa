export default class ChromeExecuter {
  static executeScript(tabId, params) {
    return chrome.scripting.executeScript(
      {
        target: { tabId: parseInt(tabId, 10) }, // 文字列でも数値に変換
        ...params,
      });
  }

  static insertCSS(tabId, params) {
    return chrome.scripting.insertCSS(
      {
        target: { tabId: parseInt(tabId, 10) }, // 数値に変換
        ...params,
      });
  }
}