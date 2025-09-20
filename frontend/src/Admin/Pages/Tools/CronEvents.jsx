import React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import CronEventsPageContent from '../../Components/Tools/CronEventsPageContent.jsx';

const CronEvents = ({ siteTitle }) => {
  document.title = `Cron Events - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <CronEventsPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default CronEvents;
