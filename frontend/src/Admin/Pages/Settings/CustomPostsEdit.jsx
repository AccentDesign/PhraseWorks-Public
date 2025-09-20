import React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import CustomPostsEditPageContent from '../../Components/Settings/CustomPostsEditPageContent.jsx';

const CustomPostNew = ({ siteTitle }) => {
  document.title = `Custom Posts - Edit - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <CustomPostsEditPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default CustomPostNew;
