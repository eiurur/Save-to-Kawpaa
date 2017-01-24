const ChromeSyncStorageManager = require('./lib/ChromeSyncStorageManager');
const HTMLMetaDataScraper = require('./lib/HTMLMetaDataScraper');
const KawpaaSender = require('./lib/KawpaaSender');
const Notification = require('./lib/Notification');

(async () => {

  Notification.log();
  const scraper = new HTMLMetaDataScraper(info);
  const htmlMetaData = scraper.scrape();
  console.log(htmlMetaData);

  const token = await ChromeSyncStorageManager.get('token')
  info = info || {};
  if(token === undefined || token === '') throw new Error('トークンが空です');
  const payload = {
    token: token,
    post: Object.assign(htmlMetaData, info),
  };
  const sender = new KawpaaSender(payload);
  sender.save()
  .then(data => Notification.success())
  .catch(err => Notification.fail(err));
  
})
