import React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import CustomPostDashboardPageContent from '../../Components/CustomPosts/CustomPostDashboardPageContent.jsx';

const CustomPostDashboard = ({ siteTitle }) => {
  document.title = `Posts - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <CustomPostDashboardPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default CustomPostDashboard;
