import React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import CustomPostNewPageContent from '../../Components/CustomPosts/CustomPostNewPageContent.jsx';

const CustomPostNew = ({ siteTitle }) => {
  document.title = `Posts - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <CustomPostNewPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default CustomPostNew;
