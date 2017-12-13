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
        return sendResponse(`ok setIcon ${infoStr}`);
      }

      if (this.isRequestFromSpecificService(request.name)) {
        infoStr = JSON.stringify(request.info);
        new KawpaaScriptExecuter(infoStr).execute();
        sendResponse(`ok ${infoStr}`);
        return;
      }

      return sendResponse(`ok ${infoStr}`);
    });
  }

  isRequestFromSpecificService(hostname) {
    var hostnameList = Object.values(SUPPORT_SERVICE);
    if (hostname.indexOf(SUPPORT_SERVICE.DEVIANTART_HOSTNAME) !== -1) {
      return true;
    }
    return hostnameList.includes(hostname);
  }
}
