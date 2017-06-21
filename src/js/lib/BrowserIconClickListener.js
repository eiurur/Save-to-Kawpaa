import KawpaaScriptExecuter from "./KawpaaScriptExecuter";

export default class BroswerIconClickListener {
  constructor() {
    return this;
  }

  activate() {
    chrome.browserAction.onClicked.addListener(tab =>
      new KawpaaScriptExecuter(null).execute()
    );
  }
}
