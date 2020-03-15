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

  const showErrorModal = async err => {
    try {
      await Notification.build({
        name: 'report',
        header: 'Save to Kawpaa',
        message: Notification.makeErrorMessgage(err),
      });
      chrome.runtime.sendMessage({ name: 'REPORT_ERROR' });
    } catch (e) {
      Notification.fail(err);
    }
  };

  const saveContentToKawpaa = async (info = {}) => {
    try {
      Notification.log();
      const token = await ChromeSyncStorageManager.get('token');
      const postData = mergePostData(info);

      const payload = {
        token: token,
        post: postData,
      };
      console.log(payload);
      const agent = new KawpaaAgent(payload);
      await agent.save();
      Notification.success();
    } catch (err) {
      await showErrorModal();
    }
  };

  // CAUTION: contents.js内のinfo変数は
  await saveContentToKawpaa(info);
})();
