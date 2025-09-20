/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useState, useMemo, useCallback, useContext } from 'react';
import { notify } from '../Utils/Notification';
import { APIConnectorContext } from './APIConnectorContext';
import { APIGetLoginToken, APIGetRefreshFromToken } from '../API/APIAuth';
import { graphqlUrl } from '../config';

export const UserContext = createContext(null);

export function UserContextProvider({ children }) {
  const { apiBase, setLoginPassword } = useContext(APIConnectorContext);
  const [loggedIn, setLoggedIn] = useState(false);
  const localUserObj = JSON.parse(localStorage.getItem('userObj'))
    ? JSON.parse(localStorage.getItem('userObj'))
    : null;

  const [user, setUser] = useState(localUserObj ?? null);
  const [isLoading, setIsLoading] = useState(true);

  const LoginUser = useCallback(
    async (email, password) => {
      const data = await APIGetLoginToken(email, password, graphqlUrl);
      if (data.status != 200) {
        localStorage.removeItem('loggedIn');
        setLoggedIn(false);
        setUser(null);
        notify('There was an error communicating with the server', 'error');
      } else {
        if (data.data?.login.token) {
          const user = data.data.login.user[0];

          localStorage.setItem('loggedIn', true);
          localStorage.setItem('userObj', JSON.stringify(user));
          setLoggedIn(true);

          setLoginPassword(data.data.login.token);
          localStorage.setItem('loginPassword', data.data.login.token);
          localStorage.setItem('refreshToken', data.data.login.refreshToken);
          let expiryDate = new Date();
          expiryDate.setHours(expiryDate.getHours() + 1);
          localStorage.setItem('loginExpiry', expiryDate.toISOString());

          const refreshExpiryDate = new Date();
          refreshExpiryDate.setDate(refreshExpiryDate.getDate() + 7);
          localStorage.setItem('refreshExpiry', refreshExpiryDate.toISOString());
          notify('You have logged in succesfully', 'success');
          return true;
        } else {
          localStorage.removeItem('loggedIn');
          setLoggedIn(false);
          setUser(null);
          notify('Incorrect Password', 'error');
        }
      }
      return false;
    },
    [apiBase],
  );

  const LogoutUser = useCallback(async () => {
    localStorage.removeItem('loggedIn');

    localStorage.clear();
    localStorage.removeItem('userObj');
    setLoggedIn(false);
    setUser(null);
    notify('You have logged out succesfully', 'success');
    return true;
  }, []);

  const verifyToken = async () => {
    const path = window.location.pathname;

    const isAdminRoute = path.startsWith('/admin');
    if (isAdminRoute) {
      const expiryDateStorage = localStorage.getItem('loginExpiry');
      const refreshTokenStorage = localStorage.getItem('refreshToken');
      const refreshExpiryStorage = localStorage.getItem('refreshExpiry');
      const isOnLoginPage = window.location.pathname === '/login';

      const now = new Date();

      if (!refreshExpiryStorage || now > new Date(refreshExpiryStorage)) {
        localStorage.clear();
        localStorage.removeItem('userObj');
        if (!isOnLoginPage) {
          window.location.href = '/login?redirect=/admin';
        }
        return;
      }

      if (refreshExpiryStorage) {
        const refreshExpiry = new Date(refreshExpiryStorage);
        if (now > refreshExpiry) {
          localStorage.clear();
          if (!isOnLoginPage) {
            window.location.href = '/login';
          }
          return;
        }
      }

      if (expiryDateStorage) {
        const accessExpiry = new Date(expiryDateStorage);
        if (now > accessExpiry) {
          const localUserObj = JSON.parse(localStorage.getItem('userObj'))
            ? JSON.parse(localStorage.getItem('userObj'))
            : null;
          const data = await APIGetRefreshFromToken(
            refreshTokenStorage,
            localUserObj.id,
            graphqlUrl,
          );

          if (data.status === 200 && data.data?.refresh) {
            const refreshExpiry = new Date(data.data.refresh.refreshTokenExpiry * 1000);
            setLoginPassword(data.data.refresh.token);
            localStorage.setItem('loginPassword', data.data.refresh.token);
            localStorage.setItem('refreshToken', data.data.refresh.refreshToken);
            localStorage.setItem('refreshExpiry', refreshExpiry.toISOString());

            const newAccessExpiry = new Date();
            newAccessExpiry.setHours(newAccessExpiry.getHours() + 1);
            localStorage.setItem('loginExpiry', newAccessExpiry.toISOString());

            window.location.reload();
          } else {
            localStorage.clear();
            if (!isOnLoginPage) {
              window.location.href = '/login';
            }
          }
          return;
        } else {
          const localUserObj = JSON.parse(localStorage.getItem('userObj'))
            ? JSON.parse(localStorage.getItem('userObj'))
            : null;
          setUser(localUserObj);
          localStorage.setItem('loggedIn', true);
          setLoggedIn(true);
          setIsLoading(false);
          return;
        }
      }
    }
    setIsLoading(false);
  };

  const userContext = useMemo(
    () => ({
      loggedIn,
      setLoggedIn,
      user,
      setUser,
      LoginUser,
      LogoutUser,
      verifyToken,
      isLoading,
    }),
    [loggedIn, setLoggedIn, user, setUser, LoginUser, LogoutUser, verifyToken, isLoading],
  );

  return <UserContext.Provider value={userContext}>{children}</UserContext.Provider>;
}
