import React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import CustomPostsPageContent from '../../Components/Settings/CustomPostsPageContent.jsx';

const CustomFields = ({ siteTitle }) => {
  document.title = `Custom Posts - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <CustomPostsPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default CustomFields;
