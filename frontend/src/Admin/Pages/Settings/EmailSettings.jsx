import React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import EmailSettingsPageContent from '../../Components/Settings/EmailSettingsPageContent.jsx';

const EmailSettings = ({ siteTitle }) => {
  document.title = `Email Settings - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <EmailSettingsPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default EmailSettings;
