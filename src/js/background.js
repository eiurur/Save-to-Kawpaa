const BrowserIconClickListener = require("./lib/BrowserIconClickListener");
const ShortcutListener = require("./lib/ShortcutListener");
const ContextMenuExtensionListener = require("./lib/ContextMenuExtensionListener");
const RuntimeMessageListener = require("./lib/RuntimeMessageListener");
const TabActivateListener = require("./lib/TabActivateListener");

[
  new ShortcutListener(),
  new BrowserIconClickListener(),
  new ContextMenuExtensionListener(),
  new RuntimeMessageListener(),
  new TabActivateListener()
].map(listener => listener.activate());
