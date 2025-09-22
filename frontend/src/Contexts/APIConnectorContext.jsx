import React, { createContext, useMemo, useState } from 'react';
import { siteUuid } from '../config';

export const APIConnectorContext = createContext(null);

export function APIConnectorContextProvider({ children }) {
  const [loginPassword, setLoginPassword] = useState(
    localStorage.getItem(`loginPassword_${siteUuid}`) ? localStorage.getItem(`loginPassword_${siteUuid}`) : null,
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
