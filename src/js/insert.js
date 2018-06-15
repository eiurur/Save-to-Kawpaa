import InsertionFactory from './lib/Insertion/InsertionFactory';

const currentHostname = location.host;
const currentUrl = location.href;

(async () => {
  const inserter = InsertionFactory.create(currentHostname, currentUrl);
  const success = await inserter.insert();
  inserter.off();
  if (success) inserter.on();
})();
