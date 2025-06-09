import React from 'react';
import VerifyLogin from '../../../VerifyLogin';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import UsersAddPageContent from '../../Components/Users/UsersAddPageContent.jsx';

const UsersAdd = ({ siteTitle }) => {
  document.title = `Add User - ${siteTitle}`;
  return (
    <VerifyLogin>
      <Header />

      <PageContent>
        <UsersAddPageContent />
      </PageContent>
      <Footer />
    </VerifyLogin>
  );
};

export default UsersAdd;
