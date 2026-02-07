/*
 * Cross-browser background worker:
 * - Chrome MV3: uses `chrome.*` in a service worker
 * - Firefox: use a MV2 build (see README) or map `browser.*` to the same code shape
 *
 * Important: don't declare a top-level `const chrome = ...` because `chrome` is already a
 * host-defined global in extension contexts (SyntaxError: already declared).
 */
(() => {
  const ext = globalThis.browser || globalThis.chrome;
  if (!ext) return;

  const actionApi = ext?.action || ext?.browserAction;
  if (actionApi?.onClicked) {
    actionApi.onClicked.addListener(() => {
      const url = ext.runtime.getURL('dashboard.html');
      ext.tabs.create({ url });
    });
  }

  /* Listen for dashboard open requests from content script */
  if (ext?.runtime?.onMessage) {
    ext.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (!message || message.action !== 'open_dashboard') return false;
      const url = ext.runtime.getURL('dashboard.html');
      const isBrowserApi = !!globalThis.browser && ext === globalThis.browser;

      try {
        if (isBrowserApi) {
          Promise.resolve(ext.tabs.create({ url }))
            .then((tab) => {
              try {
                sendResponse({ success: true, tabId: tab?.id ?? null });
              } catch {}
            })
            .catch((err) => {
              try {
                sendResponse({ success: false, error: err?.message || String(err || '') });
              } catch {}
            });
          return true;
        }

        ext.tabs.create({ url }, (tab) => {
          const err = ext.runtime.lastError;
          if (err) sendResponse({ success: false, error: err.message || String(err) });
          else sendResponse({ success: true, tabId: tab?.id ?? null });
        });
        return true;
      } catch (err) {
        try {
          sendResponse({ success: false, error: err?.message || String(err || '') });
        } catch {}
        return true;
      }
    });
  }
})();
