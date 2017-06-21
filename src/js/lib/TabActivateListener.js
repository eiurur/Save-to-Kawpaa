import ChromeExecuter from "./ChromeExecuter";

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
          file: "build/js/retrieveToken.bundle.js"
        }).then(res => console.log(res));
      });
    });
  }
}
