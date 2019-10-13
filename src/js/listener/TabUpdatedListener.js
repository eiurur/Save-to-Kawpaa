import ChromeExecuter from '../lib/utils/ChromeExecuter';
import { CHROME_EXTENSION_RESOURCES, SUPPORT_URL } from '../config/';

export default class TabUpdatedListener {
  constructor() {
    this.PIXIV_URL_PATTERN = /^https:\/\/www.pixiv.net\/artworks\/*$/;
  }

  isAllowedUrl(url) {
    return this.PIXIV_URL_PATTERN.test(url);
  }

  isRejectUrl(url) {
    return false;
  }

  insertSaveLinkInPixiv(tab) {
    if (!this.isAllowedUrl(tab.url) || this.isRejectUrl(tab.url)) {
      return;
    }
    ChromeExecuter.executeScript({
      file: CHROME_EXTENSION_RESOURCES.js.insert,
    }).then(res => console.log(res));
  }

  /**
   * 1. ページ遷移時にリロードされないサイトで保存リンクを再度挿入する。@pixiv
   */
  activate() {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status !== 'loading') {
        return;
      }
      this.insertSaveLinkInPixiv(tab);
    });
  }
}
