import ScriptExecuter from '../lib/utils/ScriptExecuter';

export default class BroswerIconClickListener {
  constructor() {
    return this;
  }

  registerContentToKawpaa() {
    new ScriptExecuter(null).execute();
  }

  activate() {
    chrome.browserAction.onClicked.addListener(tab => {
      this.registerContentToKawpaa();
    });
  }
}
