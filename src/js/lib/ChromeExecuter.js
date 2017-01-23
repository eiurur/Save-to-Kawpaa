module.exports = class ChromeExecuter {
  // constructor(items) {
  //   this.items = items;
  // }

  // getTasks() {
  //   return this.items.map((item) => {
  //     if(item.type === 'js') {
  //       return this.executeScript(item.process);
  //     }
  //     if(item.type === 'css') {
  //       return this.insertCSS(item.process);
  //     }
  //   })
  // }

  static executeScript(params) {
    return new Promise((resolve) => chrome.tabs.executeScript(null, params, () => resolve('ok') ) )
  }

  static insertCSS(params) {
    return new Promise((resolve) => chrome.tabs.insertCSS(null, params, () => resolve('ok') ) )
  }

  // execute() {}
}