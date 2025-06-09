import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from './Contexts/UserContext';

const VerifyLogin = ({ children }) => {
  const { VerifyUserLogin } = useContext(UserContext);
  const navigateTo = useNavigate();

  useEffect(() => {
    VerifyUserLogin(navigateTo);
  }, []);
  return <>{children}</>;
};

export default VerifyLogin;
