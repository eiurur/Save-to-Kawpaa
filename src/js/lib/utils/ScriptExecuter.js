import ChromeExecuter from './ChromeExecuter';
import { CHROME_EXTENSION_RESOURCES } from '../../config';

export default class ScriptExecuter {
  constructor(info) {
    this.tasks = [
      ChromeExecuter.insertCSS({ file: CHROME_EXTENSION_RESOURCES.css.lib }),
      ChromeExecuter.insertCSS({ file: CHROME_EXTENSION_RESOURCES.css.patch }),
      ChromeExecuter.executeScript({ code: `var info = ${info};` }),
    ];
    return this;
  }

  execute() {
    Promise.all(this.tasks).then((results) => {
      const task = { file: CHROME_EXTENSION_RESOURCES.js.contents };
      ChromeExecuter.executeScript(task).then((result) =>
        console.log('script injected')
      );
    });
  }
}
