import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import PageContent from '../Components/PageContent.jsx';
import DashboardPageContent from '../Components/DashboardPageContent.jsx';

const Dashboard = ({ siteTitle }) => {
  document.title = `Dashboard - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <DashboardPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default Dashboard;
