import ChromeExecuter from '../lib/utils/ChromeExecuter';
import { CHROME_EXTENSION_RESOURCES } from '../config/config';

export default class TabUpdatedListener {
  constructor() {
    this.PIXIV_URL_PATTERN = /^https:\/\/www.pixiv.net\/member_illust.*$/;
  }

  isAllowedUrl(tab) {
    return this.PIXIV_URL_PATTERN.test(tab.url);
  }

  activate() {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (!this.isAllowedUrl(changeInfo)) {
        return;
      }

      ChromeExecuter.executeScript({
        file: CHROME_EXTENSION_RESOURCES.js.insert,
      }).then(res => console.log(res));
    });
  }
}
