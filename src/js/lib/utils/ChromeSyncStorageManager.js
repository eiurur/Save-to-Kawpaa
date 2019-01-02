export default class ChromeSyncStorageManager {
  static set(item) {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set(item, () => resolve(true));
    });
  }

  static get(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get([key], item => {
        const result =
          item[key] === undefined || item[key] === '' ? null : item[key];
        return resolve(result);
      });
    });
  }
}
