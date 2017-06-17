const KawpaaScriptExecuter = require("./KawpaaScriptExecuter");

module.exports = class BroswerIconClickListener {
  constructor() {
    return this;
  }

  activate() {
    chrome.browserAction.onClicked.addListener(tab =>
      new KawpaaScriptExecuter(null).execute()
    );
  }
};
