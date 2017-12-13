export default class ChromeSyncStorageManager {
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
