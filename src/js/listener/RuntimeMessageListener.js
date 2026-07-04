import { SUPPORT_SERVICE_DOMAIN } from '../config/';
import ScriptExecuter from '../lib/utils/ScriptExecuter';
import ChromeSyncStorageManager from '../lib/utils/ChromeSyncStorageManager';
import KawpaaAgent from '../lib/domains/KawpaaAgent';

export default class RuntimeMessageListener {
  constructor() {
    return this;
  }

  changeIconState({ path, tabId }) {
    // ❌ chrome.browserAction.setIcon から ⭕️ chrome.action.setIcon に修正
    chrome.action.setIcon({
      path: path,
      tabId: tabId,
    });
  }

  registerContentToKawpaa(tabId, info) {
    // コンストラクタで tabId を渡すように修正
    new ScriptExecuter(tabId, info).execute();
  }

  openErrorReportPage() {
    chrome.tabs.create({
      active: true,
      url: 'https://github.com/eiurur/save-to-kawpaa/issues',
    });
  }

  isRequestFromSpecificService(hostname) {
    if (!hostname) return false;

    // ページ間でサブドメインが異なるサービス
    if (hostname.includes(SUPPORT_SERVICE_DOMAIN.DEVIANTART_HOSTNAME)) {
      return true;
    }
    if (hostname.includes(SUPPORT_SERVICE_DOMAIN.NIJIURA_HOSTNAME)) {
      return true;
    }

    // ページ間でサブドメインが同一のサービス
    var hostnameList = Object.values(SUPPORT_SERVICE_DOMAIN);
    return hostnameList.includes(hostname);
  }

  async fetchTweet({ tweetId }) {
    const token = await ChromeSyncStorageManager.get('token');
    const payload = {
      token,
    };
    const agent = new KawpaaAgent(payload);
    await agent.setup();
    const tweet = await agent.get(`/api/convert/tweet/${tweetId}`);
    return tweet;
  }

  activate() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log('onMessage request = ', request);

      if (request.newIconPath) {
        this.changeIconState({
          path: request.newIconPath,
          tabId: sender.tab.id,
        });
        sendResponse(`Done send link`);
        return;
      }

      if (this.isRequestFromSpecificService(request.name)) {
        this.registerContentToKawpaa(sender.tab.id, request.info);
        sendResponse(`ok`);
        return;
      } 
      
      if (request.func) {
        // 非同期（Promise）処理を実行してレスポンスを返す
        this[request.func](request)
          .then((result) => sendResponse(result))
          .catch((err) => sendResponse(err));
        return true; // MV3でも非同期でレスポンスを返すために必須
      }

      if (request.name === 'REPORT_ERROR') {
        this.openErrorReportPage();
        sendResponse(`ok`);
        return;
      }

      sendResponse(`ok`);
    });
  }
}