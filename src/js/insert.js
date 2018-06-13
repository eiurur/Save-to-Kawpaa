import InsertionFactory from './lib/Insertion/InsertionFactory';

const currentHostname = location.host;
const currentUrl = location.href;

(async () => {
  const inserter = InsertionFactory.create(currentHostname, currentUrl);
  await inserter.insert();
  inserter.on();
})();
