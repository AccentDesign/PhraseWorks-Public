import React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import CustomPostsNewPageContent from '../../Components/Settings/CustomPostsNewPageContent.jsx';

const CustomPostNew = ({ siteTitle }) => {
  document.title = `Custom Posts - New - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <CustomPostsNewPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default CustomPostNew;
