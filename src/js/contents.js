import ChromeSyncStorageManager from './lib/utils/ChromeSyncStorageManager';
import Notification from './lib/utils/Notification';
import KawpaaAgent from './lib/domains/KawpaaAgent';

(async () => {
  try {
    Notification.log();
    const token = await ChromeSyncStorageManager.get('token');
    const agent = new KawpaaAgent(token);
    agent.validate();
    agent.setPostData(info);
    await agent.register();
    Notification.success();
  } catch (err) {
    console.log(err, err.response, err.message);
    const errorReason =
      err && err.response && err.response.data
        ? err.response.data
        : err.message;
    const errorMessage =
      '<b>保存に失敗しました。</b><br><br><br><br><b>原因：</b><br><br> ' +
      errorReason +
      '<br><br><br><br><b>問題を報告しますか？</b>';

    Notification.build({
      name: 'report',
      header: 'Save to Kawpaa',
      message: errorMessage,
    })
      .then(_ => chrome.runtime.sendMessage({ name: 'REPORT_ERROR' }))
      .catch(_ => Notification.fail(err));
  }
})();
