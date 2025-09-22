import React, { useEffect, useState, useRef } from 'react';
import { ShortcodesContext } from './ShortcodesContext';
import { coreShortcodes } from './coreShortcodes';
import { APIGetShortcodes, APILogError } from '../../API/APISystem.js';
import { initWebSocket } from '../WebSocketClient';
import ErrorBoundary from '../../Components/ErrorBoundary';
import Loading from '../../Admin/Components/Loading.jsx';

const SHORTCODES_CACHE_KEY = 'shortcodes:list';

export const ShortcodesProvider = ({ children }) => {
  const [shortcodes, setShortcodes] = useState(null);
  const tabClientId = useRef(crypto.randomUUID());

  const loadShortcodesFromCache = async () => {
    let pluginShortcodes = [];
    const cached = localStorage.getItem(SHORTCODES_CACHE_KEY);

    if (cached) {
      try {
        pluginShortcodes = JSON.parse(cached);
      } catch (err) {
        await APILogError(err.stack || String(err));
        console.error('Failed to parse cached shortcodes:', err);
      }
    }

    if (!pluginShortcodes.length) {
      try {
        const resp = await APIGetShortcodes(tabClientId.current);
        if (resp?.data?.getShortcodes) {
          localStorage.setItem(SHORTCODES_CACHE_KEY, resp.data.getShortcodes);
          pluginShortcodes = JSON.parse(resp.data.getShortcodes);
        }
      } catch (err) {
        await APILogError(err.stack || String(err));
        console.error('Error fetching shortcodes:', err);
      }
    }

    const loadedPlugins = {};
    const modules = import.meta.glob('../../plugins/**/*.jsx');

    for (const sc of pluginShortcodes) {
      if (!sc.path) continue;

      const pluginPath = sc.path.replace(/^\.?\/?Plugins\//i, '');
      const normalizedPath = `../../plugins/${pluginPath}`;

      if (modules[normalizedPath]) {
        try {
          const module = await modules[normalizedPath]();
          loadedPlugins[sc.name.toLowerCase()] = module.default;
        } catch (err) {
          await APILogError(err.stack || String(err));
          console.error(`Failed to import module ${normalizedPath}:`, err);
          // Skip this plugin without crashing
        }
      }
    }

    setShortcodes({ ...coreShortcodes, ...loadedPlugins });
  };

  useEffect(() => {
    const ws = initWebSocket(
      tabClientId.current,
      async (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'PLUGIN_UPDATE') {
            try {
              const resp = await APIGetShortcodes(tabClientId.current);
              if (resp?.data?.getShortcodes) {
                localStorage.setItem(SHORTCODES_CACHE_KEY, resp.data.getShortcodes);
                await loadShortcodesFromCache();
              }
            } catch (err) {
              await APILogError(err.stack || String(err));
              console.error('Error loading shortcodes on PLUGIN_UPDATE:', err);
            }
          }
        } catch (err) {
          await APILogError(err.stack || String(err));
          console.error('Error handling WebSocket message:', err);
        }
      },
      async () => {
        try {
          await loadShortcodesFromCache();
        } catch (err) {
          await APILogError(err.stack || String(err));
          console.error('Error in initial WebSocket connection:', err);
        }
      },
    );

    // Initial load
    loadShortcodesFromCache().catch((err) =>
      console.error('Error loading shortcodes initially:', err),
    );

    return () => {
      // Safely close WebSocket connection
      if (ws && ws.readyState === WebSocket.OPEN) {
        try {
          ws.close();
        } catch (e) {
          console.warn('Error closing WebSocket in cleanup:', e);
        }
      }
    };
  }, []);

  if (!shortcodes) return <Loading />;

  return (
    <ErrorBoundary context="plugin">
      <ShortcodesContext.Provider value={shortcodes}>{children}</ShortcodesContext.Provider>
    </ErrorBoundary>
  );
};
