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
        'トークンが未登録です。<br> 拡張機能のオプションページでトークンを登録してください',
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
    err ? console.log(err.respponse) : console.log(err);
    Notification.build({
      name: 'report',
      header: 'Save to Kawpaa',
      message: '保存に失敗しました。<br><br>問題を報告しますか？',
      // '保存に失敗しました。<br><br><br><br>原因：<br><br> ' +
      // err.message +
      // '<br><br><br><br>問題を報告しますか？',
    })
      .then(_ => chrome.runtime.sendMessage({ name: 'REPORT_ERROR' }))
      .catch(_ => Notification.fail(err));
  }
})();
