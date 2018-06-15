import ChromeExecuter from '../lib/utils/ChromeExecuter';
import { CHROME_EXTENSION_RESOURCES, SUPPORT_URL } from '../config/config';

export default class TabUpdatedListener {
  constructor() {
    this.PIXIV_URL_PATTERN = /^https:\/\/www.pixiv.net\/member_illust.php\?mode=medium.*$/;
  }

  isAllowedUrl(tab) {
    return this.PIXIV_URL_PATTERN.test(tab.url);
  }

  isRejectUrl(tab) {
    return tab.url && tab.url.includes(SUPPORT_URL.PIXIV_MANGA_URL);
  }

  activate() {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status !== 'loading') {
        return;
      }

      if (!this.isAllowedUrl(changeInfo) || this.isRejectUrl(changeInfo)) {
        return;
      }

      ChromeExecuter.executeScript({
        file: CHROME_EXTENSION_RESOURCES.js.insert,
      }).then(res => console.log(res));
    });
  }
}
