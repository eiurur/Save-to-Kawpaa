import BrowserIconClickListener from './listener/BrowserIconClickListener';
import ShortcutListener from './listener/ShortcutListener';
import ContextMenuExtensionListener from './listener/ContextMenuExtensionListener';
import RuntimeMessageListener from './listener/RuntimeMessageListener';
import TabActivateListener from './listener/TabActivateListener';

[
  new ShortcutListener(),
  new BrowserIconClickListener(),
  new ContextMenuExtensionListener(),
  new RuntimeMessageListener(),
  new TabActivateListener(),
].map(listener => listener.activate());
