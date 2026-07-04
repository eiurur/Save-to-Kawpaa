import ChromeExecuter from './ChromeExecuter';
import { CHROME_EXTENSION_RESOURCES } from '../../config';

export default class ScriptExecuter {
  constructor(tabId, info) { // tabId を引数に追加
    this.tabId = tabId;
    this.tasks = [
      ChromeExecuter.insertCSS(this.tabId, { files: [CHROME_EXTENSION_RESOURCES.css.lib] }),
      ChromeExecuter.insertCSS(this.tabId, { files: [CHROME_EXTENSION_RESOURCES.css.patch] }),
      ChromeExecuter.executeScript(this.tabId, { func: (info) => { window.info = info; }, args: [info] }),
    ];
    return this;
  }

  execute() {
    Promise.all(this.tasks).then(() => {
      const task = { files: [CHROME_EXTENSION_RESOURCES.js.contents] };
      ChromeExecuter.executeScript(this.tabId, task).then(() =>
        console.log('script injected')
      );
    });
  }
}