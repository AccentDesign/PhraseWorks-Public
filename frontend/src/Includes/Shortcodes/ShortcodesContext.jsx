import { createContext, useContext } from 'react';

export const ShortcodesContext = createContext(null);

export const useShortcodes = () => {
  const ctx = useContext(ShortcodesContext);
  if (!ctx) throw new Error('useShortcodes must be used within ShortcodesProvider');
  return ctx;
};
