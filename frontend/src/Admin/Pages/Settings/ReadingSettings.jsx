import React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import ReadingSettingsPageContent from '../../Components/Settings/ReadingSettingsPageContent.jsx';

const ReadingSettings = ({ siteTitle }) => {
  document.title = `Reading Settings - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <ReadingSettingsPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default ReadingSettings;
