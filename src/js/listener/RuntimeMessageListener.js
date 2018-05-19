import { SUPPORT_SERVICE } from '../config/config';
import KawpaaScriptExecuter from '../lib/KawpaaScriptExecuter';

export default class RuntimeMessageListener {
  constructor() {
    return this;
  }

  activate() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      var infoStr;

      console.log('onMessage request = ', request);

      if (request.newIconPath) {
        console.log('new Icon Path');
        chrome.browserAction.setIcon({
          path: request.newIconPath,
          tabId: sender.tab.id,
        });
        return sendResponse(`Done send link`);
      }

      if (this.isRequestFromSpecificService(request.name)) {
        infoStr = JSON.stringify(request.info);
        new KawpaaScriptExecuter(infoStr).execute();
        sendResponse(`ok ${infoStr}`);
        return;
      }

      if (request.name === 'REPORT_ERROR') {
        chrome.tabs.create({
          active: true,
          url: 'https://github.com/eiurur/save-to-kawpaa/issues',
        });
      }

      return sendResponse(`ok ${infoStr}`);
    });
  }

  isRequestFromSpecificService(hostname) {
    var hostnameList = Object.values(SUPPORT_SERVICE);

    // ページ間でサブドメインが異なるサービス
    if (hostname.includes(SUPPORT_SERVICE.DEVIANTART_HOSTNAME)) {
      return true;
    }
    if (hostname.includes(SUPPORT_SERVICE.NIJIURA_HOSTNAME)) {
      return true;
    }

    // ページ間でサブドメインが同一のサービス
    return hostnameList.includes(hostname);
  }
}
