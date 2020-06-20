import InsertionFactory from './lib/domains/inserter/InsertionFactory';

(async () => {
  InsertionFactory.clean();

  const currentHostname = location.host;
  const currentUrl = location.href;
  const inserter = InsertionFactory.create(currentHostname, currentUrl);
  console.log(inserter);
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
