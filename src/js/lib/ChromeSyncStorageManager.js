module.exports = class ChromeSyncStorageManager {
  static get(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get([key], (item) => {
        if ((item[key] === undefined) || (item[key] === '')) { 
          return reject(undefined); 
        }
        return resolve(item[key]);
      })
    });
  }
}