import React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import UsersPageContent from '../../Components/Users/UsersPageContent.jsx';

const Users = ({ siteTitle }) => {
  document.title = `Users - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <UsersPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default Users;
