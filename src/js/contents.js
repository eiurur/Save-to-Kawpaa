import ChromeSyncStorageManager from './lib/ChromeSyncStorageManager';
import HTMLMetaDataScraper from './lib/HTMLMetaDataScraper';
import KawpaaSender from './lib/KawpaaSender';
import Notification from './lib/Notification';

Notification.log();
ChromeSyncStorageManager.get('token')
  .then(token => {
    console.log(token);
    info = info || {};
    if (!token)
      throw new Error(
        'トークンが空です。Kawpaaにアクセスしてトークンを登録してください',
      );

    const scraper = new HTMLMetaDataScraper(info);
    const htmlMetaData = scraper.scrape();
    console.log(htmlMetaData);

    const payload = {
      token: token,
      post: Object.assign(htmlMetaData, info),
    };
    const sender = new KawpaaSender(payload);
    return sender.save();
  })
  .then(data => Notification.success())
  .catch(err => Notification.fail(err));
