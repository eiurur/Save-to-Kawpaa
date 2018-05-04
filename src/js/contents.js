import ChromeSyncStorageManager from './lib/utils/ChromeSyncStorageManager';
import HTMLMetaDataScraper from './lib/HTMLMetaDataScraper';
import KawpaaSender from './lib/KawpaaSender';
import Notification from './lib/Notification';

(async () => {
  try {
    Notification.log();

    // トークンの取得
    const token = await ChromeSyncStorageManager.get('token');
    if (!token) {
      throw new Error(
        'トークンが空です。Kawpaaにアクセスしてトークンを登録してください',
      );
    }

    // メタデータの収取
    info = info || {};
    const scraper = new HTMLMetaDataScraper(info);
    const htmlMetaData = scraper.scrape();
    console.log(htmlMetaData);

    // メタデータをKawpaaサーバに送信＋保存
    const payload = {
      token: token,
      post: Object.assign(htmlMetaData, info),
    };
    const sender = new KawpaaSender(payload);
    await sender.save();

    Notification.success();
  } catch (err) {
    Notification.fail(err);
  }
})();
