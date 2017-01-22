const ChromeSyncStorageManager = require('./lib/ChromeSyncStorageManager');
const HTMLMetaDataScraper = require('./lib/HTMLMetaDataScraper');
const KawpaaSender = require('./lib/KawpaaSender');
const Notification = require('./lib/Notification');


Notification.log();
const scraper = new HTMLMetaDataScraper(info);
const htmlMetaData = scraper.scrape();
console.log(htmlMetaData);

ChromeSyncStorageManager.get('token')
.then( (token) => {
  info = info || {};
  if(token === undefined || token === '') throw new Error('トークンが空です');
  const payload = {
    token: token,
    post: Object.assign(htmlMetaData, info),
  };
  const sender = new KawpaaSender(payload);
  return sender.save()
})
.then(data => Notification.success())
.catch(err => Notification.fail(err));