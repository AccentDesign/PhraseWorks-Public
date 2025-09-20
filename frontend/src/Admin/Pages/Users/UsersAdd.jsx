import React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import UsersAddPageContent from '../../Components/Users/UsersAddPageContent.jsx';

const UsersAdd = ({ siteTitle }) => {
  document.title = `Add User - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <UsersAddPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default UsersAdd;
