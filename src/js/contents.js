import ChromeSyncStorageManager from './lib/utils/ChromeSyncStorageManager';
import Notification from './lib/utils/Notification';
import MetaDataScraperFactory from './lib/metaData/MetaDataScraperFactory';
import KawpaaAgent from './lib/domains/KawpaaAgent';

(async () => {
  const mergePostData = (info = {}) => {
    const scraper = MetaDataScraperFactory.create(info);
    const htmlMetaData = scraper.scrape(info);
    return Object.assign(htmlMetaData, info);
  };
  
  function bytes2(str) {
    return(encodeURIComponent(str).replace(/%../g,"x").length);
  }

  const showErrorModal = async err => {
    try {
      await Notification.build({
        name: 'report',
        header: 'Save to Kawpaa',
        message: Notification.makeErrorMessgage(err),
      });
      // chrome.runtime.sendMessage({ name: 'REPORT_ERROR' });
    } catch (e) {
      Notification.fail(e);
    }
  };

  const save = async (postData) => {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          func: 'saveToKawpaa',
          postData: postData,
        },
        (response) => {
          if(response && response.status) {
            return resolve(response);
          }
          else {
            return reject(response);
          }
        },
      );
    });
  }


  const saveContentToKawpaa = async (info = {}) => {
    try {
      Notification.log();
      const token = await ChromeSyncStorageManager.get('token');
      const postData = mergePostData(info);
      const contentByte = bytes2(postData.content)
      console.log(contentByte)
      console.log(bytes2(JSON.stringify(postData)))
      if(contentByte > 1024 * 20) { // TODO: 要調査
        postData.content = ''
      }
      await save(postData);
      Notification.success();
    } catch (err) {
      Notification.fail(err);
      // await showErrorModal(err);
    }
  };

  // CAUTION: contents.js内のinfo変数は
  await saveContentToKawpaa(info);
})();
