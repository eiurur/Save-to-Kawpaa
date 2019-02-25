import ChromeExecuter from '../lib/utils/ChromeExecuter';
import { CHROME_EXTENSION_RESOURCES } from '../config/';

export default class TabActivateListener {
  constructor() {
    this.CAN_RETRIEVE_PATTERN = /^https:\/\/kawpaa.eiurur.xyz(|\/|\/account)$/;
  }

  isRetrivingUrl(url) {
    return this.CAN_RETRIEVE_PATTERN.test(url);
  }

  retriveToken(tab) {
    if (!this.isRetrivingUrl(tab.url)) {
      return;
    }

    ChromeExecuter.executeScript({
      file: CHROME_EXTENSION_RESOURCES.js.token,
    }).then(res => console.log(res));
  }

  /**
   * 1. 特定のURLでトークンを抽出し、ChromeExtensionのstorageに保存する。
   */
  activate() {
    chrome.tabs.onActivated.addListener(tabInfo => {
      chrome.tabs.get(tabInfo.tabId, tab => this.retriveToken(tab));
    });
  }
}
