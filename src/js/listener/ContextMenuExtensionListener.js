import ScriptExecuter from '../lib/domains/ScriptExecuter';
import { ENDPOINT } from '../config/';

export default class ContextMenuExtensionListener {
  constructor() {
    this.contexts = ['page', 'image', 'selection', 'video'];
    this.rebuildContextMext();
    return this;
  }

  rebuildContextMext() {
    chrome.contextMenus.removeAll(() => {
      this.createContextMenu();
      this.createBrowserIconContextMenu();
    });
  }

  createContextMenu() {
    this.contexts
      .map(context => {
        const title = `Save to Kawpaa with ${context}`;
        return {
          title: title,
          contexts: [context],
          id: context,
        };
      })
      .forEach(contextMenu => chrome.contextMenus.create(contextMenu));
  }

  createBrowserIconContextMenu() {
    chrome.contextMenus.create({
      title: 'Open Kawpaa',
      contexts: ['browser_action'],
      id: 'browser_action_open_kawpaa',
    });
  }

  goToKawpaa() {
    chrome.tabs.create({ url: ENDPOINT.PROD, active: true }, tab =>
      console.log('open Kawpaa'),
    );
  }

  registerContentToKawpaa(info) {
    new ScriptExecuter(info).execute();
  }

  activate() {
    chrome.contextMenus.onClicked.addListener((info, tab) => {
      if (info.menuItemId === 'browser_action_open_kawpaa') {
        return this.goToKawpaa();
      }
      this.registerContentToKawpaa(JSON.stringify(info));
    });
  }
}
