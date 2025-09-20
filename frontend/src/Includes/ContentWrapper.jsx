import React from 'react';
import { UserContext } from '../Contexts/UserContext';
import { useContext } from 'react';

const ContentWrapper = ({ children }) => {
  const { user, LogoutUser } = useContext(UserContext);
  return (
    <div
      className={`${
        user?.user_role?.role == 'administrator' ||
        user?.user_role?.role == 'editor' ||
        user?.user_role?.role == 'contributor'
          ? 'pt-[7rem] lg:pt-[7rem]'
          : 'pt-[5rem] lg:pt-[4rem]'
      }`}
    >
      {children}
    </div>
  );
};

export default ContentWrapper;
