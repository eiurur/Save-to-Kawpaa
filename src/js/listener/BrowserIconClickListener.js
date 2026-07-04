import ScriptExecuter from '../lib/utils/ScriptExecuter';

export default class BroswerIconClickListener {
  constructor() {
    return this;
  }

  registerContentToKawpaa(tabId, info) {
    // コンストラクタで tabId を渡すように修正
    new ScriptExecuter(tabId, info).execute();
  }

  activate() {
    chrome.action.onClicked.addListener(tab => {
      this.registerContentToKawpaa(tab.id, {});
    });
  }
}