import 'babel-polyfill';
import ChromeSyncStorageManager from './lib/ChromeSyncStorageManager';
import HTMLMetaDataScraper from './lib/HTMLMetaDataScraper';
import KawpaaSender from './lib/KawpaaSender';
import Notification from './lib/Notification';

(async () => {
  try {
    Notification.log();
    const token = await ChromeSyncStorageManager.get('token');
    console.log(token);
    if (!token)
      throw new Error(
        'トークンが空です。Kawpaaにアクセスしてトークンを登録してください',
      );

    info = info || {};
    const scraper = new HTMLMetaDataScraper(info);
    const htmlMetaData = scraper.scrape();
    console.log(htmlMetaData);

    const payload = {
      token: token,
      post: Object.assign(htmlMetaData, info),
    };
    const sender = new KawpaaSender(payload);
    await sender.save();
    Notification.success();
  } catch (e) {
    Notification.fail(err);
  }
})();
