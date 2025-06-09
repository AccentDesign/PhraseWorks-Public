import React from 'react';
import VerifyLogin from '../../../VerifyLogin';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import UsersPageContent from '../../Components/Users/UsersPageContent.jsx';

const Users = ({ siteTitle }) => {
  document.title = `Users - ${siteTitle}`;
  return (
    <VerifyLogin>
      <Header />

      <PageContent>
        <UsersPageContent />
      </PageContent>
      <Footer />
    </VerifyLogin>
  );
};

export default Users;
