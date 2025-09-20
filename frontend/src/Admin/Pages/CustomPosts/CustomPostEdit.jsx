import React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import CustomPostEditPageContent from '../../Components/CustomPosts/CustomPostEditPageContent.jsx';

const CustomPostEdit = ({ siteTitle }) => {
  document.title = `Posts - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <CustomPostEditPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default CustomPostEdit;
