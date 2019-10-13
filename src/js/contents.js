import ChromeSyncStorageManager from './lib/utils/ChromeSyncStorageManager';
import Notification from './lib/utils/Notification';
import KawpaaAgent from './lib/domains/KawpaaAgent';

(async () => {
  try {
    Notification.log();
    const token = await ChromeSyncStorageManager.get('token');
    const agent = new KawpaaAgent(token);
    agent.setPostData(info);
    await agent.register();
    Notification.success();
  } catch (err) {
    console.log(err, err.response, err.message);
    Notification.build({
      name: 'report',
      header: 'Save to Kawpaa',
      message: Notification.makeErrorMessgage(err),
    })
      .then(_ => chrome.runtime.sendMessage({ name: 'REPORT_ERROR' }))
      .catch(_ => Notification.fail(err));
  }
})();
