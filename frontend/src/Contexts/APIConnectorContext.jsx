import React, { createContext, useMemo, useState } from 'react';

export const APIConnectorContext = createContext(null);

export function APIConnectorContextProvider({ children }) {
  const [loginPassword, setLoginPassword] = useState(
    localStorage.getItem('loginPassword') ? localStorage.getItem('loginPassword') : null,
  );
  const aPIConnectorContext = useMemo(
    () => ({ setLoginPassword, loginPassword }),
    [setLoginPassword, loginPassword],
  );

  return (
    <APIConnectorContext.Provider value={aPIConnectorContext}>
      {children}
    </APIConnectorContext.Provider>
  );
}
