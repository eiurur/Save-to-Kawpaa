const KawpaaScriptExecuter = require("./KawpaaScriptExecuter");

module.exports = class ShortcutListener {
  constructor() {
    chrome.commands.getAll(cs => console.log(cs));
    return this;
  }

  activate() {
    chrome.commands.onCommand.addListener(command =>
      console.log("Command:", command)
    );
  }
};
