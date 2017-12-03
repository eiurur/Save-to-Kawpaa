import KawpaaScriptExecuter from '../lib/KawpaaScriptExecuter';

export default class ShortcutListener {
  constructor() {
    return this;
  }

  activate() {
    chrome.commands.onCommand.addListener(command =>
      console.log('Command:', command),
    );
  }
}
