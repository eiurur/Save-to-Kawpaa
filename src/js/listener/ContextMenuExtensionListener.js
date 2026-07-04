import ScriptExecuter from '../lib/utils/ScriptExecuter';
import { ENDPOINT } from '../config/';

export default class ContextMenuExtensionListener {
constructor() {
    this.contexts = ['page', 'image', 'selection', 'video'];
  }


  rebuildContextMext() {
    // 確実にメニューをリセットしてから作成
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
      contexts: ['action'],
      id: 'browser_action_open_kawpaa',
    });
  }

  goToKawpaa() {
    chrome.tabs.create({ url: ENDPOINT.PROD, active: true }, tab =>
      console.log('open Kawpaa'),
    );
  }

  registerContentToKawpaa(tabId, info) {
    // tabId が undefined にならないようガード
    if (tabId) {
      new ScriptExecuter(tabId, info).execute();
    }
  }

  activate() {
    // 既存のリスナーがあれば一度オフにする（重複登録防止）
    chrome.contextMenus.onClicked.removeListener(this.handleContextMenuClick);
    chrome.contextMenus.onClicked.addListener(this.handleContextMenuClick);
    this.rebuildContextMext(); // メニューの作成
  }

  // アロー関数を使って this を保持
  handleContextMenuClick = (info, tab) => {
    if (info.menuItemId === 'browser_action_open_kawpaa') {
      return this.goToKawpaa();
    }
    // ここで tab.id が取れているかチェック
    this.registerContentToKawpaa(tab ? tab.id : null, info);
  }
}