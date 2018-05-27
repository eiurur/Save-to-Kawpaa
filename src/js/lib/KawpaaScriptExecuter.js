import ChromeExecuter from './utils/ChromeExecuter';
import ChromeSyncStorageManager from './utils/ChromeSyncStorageManager';
import { CHROME_EXTENSION_RESOURCES } from '../config/config';

export default class KawpaaScriptExecuter {
  constructor(info) {
    this.tasks = [
      ChromeExecuter.insertCSS({ file: CHROME_EXTENSION_RESOURCES.css.lib }),
      ChromeExecuter.executeScript({ code: `var info = ${info};` }),
    ];
    return this;
  }

  execute() {
    Promise.all(this.tasks).then(results => {
      const task = { file: CHROME_EXTENSION_RESOURCES.js.contents };
      ChromeExecuter.executeScript(task).then(result =>
        console.log('script injected'),
      );
    });
  }
}
