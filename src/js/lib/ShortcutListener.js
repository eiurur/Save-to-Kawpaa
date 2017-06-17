const KawpaaScriptExecuter = require("./KawpaaScriptExecuter");

module.exports = class ShortcutListener {
  constructor() {
    return this;
  }

  activate() {
    chrome.commands.onCommand.addListener(command =>
      console.log("Command:", command)
    );
  }
};
