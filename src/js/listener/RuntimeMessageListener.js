import { SUPPORT_SERVICE } from '../config/config';
import ScriptExecuter from '../lib/domains/ScriptExecuter';

export default class RuntimeMessageListener {
  constructor() {
    return this;
  }

  changeIconState({ path, tabId }) {
    chrome.browserAction.setIcon({
      path: path,
      tabId: tabId,
    });
  }

  registerContentToKawpaa(info) {
    new ScriptExecuter(info).execute();
  }

  openErrorReportPage() {
    chrome.tabs.create({
      active: true,
      url: 'https://github.com/eiurur/save-to-kawpaa/issues',
    });
  }

  isRequestFromSpecificService(hostname) {
    // ページ間でサブドメインが異なるサービス
    if (hostname.includes(SUPPORT_SERVICE.DEVIANTART_HOSTNAME)) {
      return true;
    }
    if (hostname.includes(SUPPORT_SERVICE.NIJIURA_HOSTNAME)) {
      return true;
    }

    // ページ間でサブドメインが同一のサービス
    var hostnameList = Object.values(SUPPORT_SERVICE);
    return hostnameList.includes(hostname);
  }

  activate() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log('onMessage request = ', request);

      if (request.newIconPath) {
        this.changeIconState({
          path: request.newIconPath,
          tabId: sender.tab.id,
        });
        return sendResponse(`Done send link`);
      }

      if (this.isRequestFromSpecificService(request.name)) {
        this.registerContentToKawpaa(JSON.stringify(request.info));
      }

      if (request.name === 'REPORT_ERROR') {
        this.openErrorReportPage();
      }

      return sendResponse(`ok`);
    });
  }
}
