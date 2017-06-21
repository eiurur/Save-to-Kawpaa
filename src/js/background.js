import BrowserIconClickListener from "./lib/BrowserIconClickListener";
import ShortcutListener from "./lib/ShortcutListener";
import ContextMenuExtensionListener from "./lib/ContextMenuExtensionListener";
import RuntimeMessageListener from "./lib/RuntimeMessageListener";
import TabActivateListener from "./lib/TabActivateListener";

[
  new ShortcutListener(),
  new BrowserIconClickListener(),
  new ContextMenuExtensionListener(),
  new RuntimeMessageListener(),
  new TabActivateListener()
].map(listener => listener.activate());
