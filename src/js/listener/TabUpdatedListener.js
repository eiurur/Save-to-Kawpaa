import ChromeExecuter from '../lib/utils/ChromeExecuter';
import { CHROME_EXTENSION_RESOURCES } from '../config/config';

export default class TabUpdatedListener {
  constructor() {
    const manifest = chrome.runtime.getManifest();
    this.DEVIANTART_URL_PATTERN = /^https:\/\/.*\.deviantart\.com\/art\/.*$/;
  }

  isAllowedUrl(tab) {
    return this.DEVIANTART_URL_PATTERN.test(tab.url);
  }

  activate() {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      console.log(changeInfo.url);
      if (!this.isAllowedUrl(changeInfo)) {
        return;
      }

      ChromeExecuter.executeScript({
        file: CHROME_EXTENSION_RESOURCES.js.insert,
      }).then(res => console.log(res));
    });
  }
}
