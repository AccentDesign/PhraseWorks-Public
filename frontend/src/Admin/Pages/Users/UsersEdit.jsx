import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import UsersEditPageContent from '../../Components/Users/UsersEditPageContent.jsx';

const UsersEdit = ({ siteTitle }) => {
  document.title = `Edit User - ${siteTitle}`;
  const { id } = useParams();
  return (
    <>
      <Header />

      <PageContent>
        <UsersEditPageContent id={id} />
      </PageContent>
      <Footer />
    </>
  );
};

export default UsersEdit;
