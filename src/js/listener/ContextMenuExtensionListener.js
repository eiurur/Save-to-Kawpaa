import KawpaaScriptExecuter from '../lib/KawpaaScriptExecuter';
import { ENDPOINT } from '../config/config';

export default class ContextMenuExtensionListener {
  constructor() {
    this.contexts = ['page', 'image', 'selection', 'video'];
    this.create();
    return this;
  }

  activate() {
    chrome.contextMenus.onClicked.addListener(this.onClick);
  }

  create() {
    chrome.contextMenus.removeAll(() => {
      this.contexts.forEach(context => {
        const title = `Save to Kawpaa with ${context}`;
        chrome.contextMenus.create({
          title: title,
          contexts: [context],
          id: context,
        });
      });

      chrome.contextMenus.create({
        title: 'Open Kawpaa',
        contexts: ['browser_action'],
        id: 'browser_action_open_kawpaa',
      });
    });
  }

  onClick(info, tab) {
    if (info.menuItemId === 'browser_action_open_kawpaa') {
      chrome.tabs.create({ url: ENDPOINT.PROD, active: true }, tab =>
        console.log('open Kawpaa'),
      );
      return;
    }
    console.log(tab);
    console.log(info);
    let infoStr = JSON.stringify(info);
    new KawpaaScriptExecuter(infoStr).execute();
  }
}
