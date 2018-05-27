import ChromeExecuter from '../lib/utils/ChromeExecuter';
import { CHROME_EXTENSION_RESOURCES } from '../config/config';

export default class TabActivateListener {
  constructor() {
    this.CAN_RETRIEVE_PATTERN = /^https:\/\/kawpaa.eiurur.xyz(|\/|\/account)$/;
  }

  isAllowedRetrieving(tab) {
    return this.CAN_RETRIEVE_PATTERN.test(tab.url);
  }

  activate() {
    chrome.tabs.onActivated.addListener(tabInfo => {
      chrome.tabs.get(tabInfo.tabId, tab => {
        if (!this.isAllowedRetrieving(tab)) {
          return;
        }

        ChromeExecuter.executeScript({
          file: CHROME_EXTENSION_RESOURCES.js.retriveToken,
        }).then(res => console.log(res));
      });
    });
  }
}
