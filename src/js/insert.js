import InsertionFactory from './lib/domains/inserter/InsertionFactory';

const currentHostname = location.host;
const currentUrl = location.href;

(async () => {
  InsertionFactory.clean();

  const inserter = InsertionFactory.create(currentHostname, currentUrl);
  if (!Array.isArray(inserter)) {
    const success = await inserter.insert();
    if (success) inserter.on();
    return;
  }
  for (let i of inserter) {
    if (!i.exist()) continue;
    const success = await i.insert();
    if (success) i.on();
    return;
  }
})();
