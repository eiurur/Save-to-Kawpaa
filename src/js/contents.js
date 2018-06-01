import ChromeSyncStorageManager from './lib/utils/ChromeSyncStorageManager';
import MetaDataScraperFactory from './lib/MetaDataScraperFactory';
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
    const scraper = MetaDataScraperFactory.create(info);
    const htmlMetaData = scraper.scrape(info);
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
    !!err.response
      ? console.log('err.response', err.response)
      : console.log('err', err);
    const errorReason =
      err && err.response ? err.response.data.message : err.message;
    Notification.build({
      name: 'report',
      header: 'Save to Kawpaa',
      // message: '保存に失敗しました。<br><br>問題を報告しますか？',
      message:
        '<b>保存に失敗しました。</b><br><br><br><br><b>原因：</b><br><br> ' +
        errorReason +
        '<br><br><br><br><b>問題を報告しますか？</b>',
    })
      .then(_ => chrome.runtime.sendMessage({ name: 'REPORT_ERROR' }))
      .catch(_ => Notification.fail(err));
  }
})();
