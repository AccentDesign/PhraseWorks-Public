import React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import WritingSettingsPageContent from '../../Components/Settings/WritingSettingsPageContent.jsx';

const WritingSettings = ({ siteTitle }) => {
  document.title = `Writing Settings - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <WritingSettingsPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default WritingSettings;
