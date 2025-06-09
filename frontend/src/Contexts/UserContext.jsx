import React, { createContext, useState, useMemo, useCallback, useContext } from 'react';
import { notify } from '../Utils/Notification';
import { APIConnectorContext } from './APIConnectorContext';
import { APIGetLoginToken, APIGetRefreshFromToken } from '../API/APIAuth';
import { graphqlUrl } from '../config';

export const UserContext = createContext(null);

export function UserContextProvider({ children }) {
  const { apiBase, setLoginPassword } = useContext(APIConnectorContext);
  const [loggedIn, setLoggedIn] = useState(false);
  const localUserObj = JSON.parse(sessionStorage.getItem('userObj'))
    ? JSON.parse(sessionStorage.getItem('userObj'))
    : null;

  const [user, setUser] = useState(localUserObj ?? null);

  const LoginUser = useCallback(
    async (email, password) => {
      const data = await APIGetLoginToken(email, password, graphqlUrl);
      if (data.status != 200) {
        sessionStorage.removeItem('loggedIn');
        setLoggedIn(false);
        setUser(null);
        notify('There was an error communicating with the server', 'error');
      } else {
        if (data.data.login.token) {
          const user = data.data.login.user[0];

          sessionStorage.setItem('loggedIn', true);
          sessionStorage.setItem('userObj', JSON.stringify(user));
          setLoggedIn(true);

          setLoginPassword(data.data.login.token);
          localStorage.setItem('loginPassword', data.data.login.token);
          localStorage.setItem('refreshToken', data.data.login.refreshToken);
          let expiryDate = new Date();
          expiryDate.setHours(expiryDate.getHours() + 1);
          localStorage.setItem('loginExpiry', expiryDate.toISOString());
          notify('You have logged in succesfully', 'success');
          return true;
        } else {
          sessionStorage.removeItem('loggedIn');
          setLoggedIn(false);
          setUser(null);
          notify('Incorrect Token', 'error');
        }
      }
      return false;
    },
    [apiBase],
  );

  const LogoutUser = useCallback(async () => {
    sessionStorage.removeItem('loggedIn');
    sessionStorage.removeItem('userObj');
    setLoggedIn(false);
    setUser(null);
    notify('You have logged out succesfully', 'success');
    return true;
  }, []);

  const VerifyUserLogin = async (navigateTo) => {
    const currentTokenStorage = localStorage.getItem('loginPassword');
    const expiryDateStorage = localStorage.getItem('loginExpiry');

    if (expiryDateStorage) {
      let expiryDate = new Date(expiryDateStorage);
      let currentDate = new Date();
      if (expiryDate >= currentDate) {
        if (currentTokenStorage != null) {
          return true;
        } else {
          setLoggedIn(false);
          setUser(null);
          notify('Your login data is incorrect, please log back in', 'error');
          navigateTo('/login');
        }
      } else {
        const refreshTokenStorage = localStorage.getItem('refreshToken');
        const data = await APIGetRefreshFromToken(refreshTokenStorage, graphqlUrl);
        if (data.status == 200) {
          const user = data.data.refresh.user[0];
          setUser(user);

          sessionStorage.setItem('loggedIn', true);
          sessionStorage.setItem('userObj', JSON.stringify(user));
          setLoggedIn(true);

          setLoginPassword(data.data.refresh.token);
          localStorage.setItem('loginPassword', data.data.refresh.token);
          localStorage.setItem('refreshToken', data.data.refresh.refreshToken);
          let expiryDate = new Date();
          expiryDate.setHours(expiryDate.getHours() + 1);
          localStorage.setItem('loginExpiry', expiryDate.toISOString());
          window.location.reload();
          return;
        } else {
          notify('Your refresh token has expired, please log back in', 'error');
          localStorage.removeItem('loginPassword');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('loginExpiry');
          navigateTo('/login');
        }
      }
    } else {
      setLoggedIn(false);
      setUser(null);
      notify('Your access token has expired, please log back in', 'error');
      navigateTo('/login');
    }
  };

  const userContext = useMemo(
    () => ({
      loggedIn,
      setLoggedIn,
      user,
      setUser,
      LoginUser,
      LogoutUser,
      VerifyUserLogin,
    }),
    [loggedIn, setLoggedIn, user, setUser, LoginUser, LogoutUser, VerifyUserLogin],
  );

  return <UserContext.Provider value={userContext}>{children}</UserContext.Provider>;
}
