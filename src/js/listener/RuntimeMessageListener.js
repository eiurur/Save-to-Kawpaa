import { SUPPORT_SERVICE } from '../config/';
import ScriptExecuter from '../lib/domains/ScriptExecuter';
import ChromeSyncStorageManager from '../lib/utils/ChromeSyncStorageManager';
import KawpaaSender from '../lib/domains/KawpaaSender';

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

  async fetchTweet({ tweetId }) {
    const token = await ChromeSyncStorageManager.get('token');
    const payload = {
      token: token,
    };
    const sender = new KawpaaSender(payload);
    return sender.get(`/api/convert/tweet/${tweetId}`);
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

      if (request.func) {
        this[request.func](request).then(result => sendResponse(result));
        return true; // Will respond asynchronously.
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
