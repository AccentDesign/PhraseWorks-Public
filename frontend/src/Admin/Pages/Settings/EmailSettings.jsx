import React from 'react';
import VerifyLogin from '../../../VerifyLogin';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import EmailSettingsPageContent from '../../Components/Settings/EmailSettingsPageContent.jsx';

const EmailSettings = ({ siteTitle }) => {
  document.title = `Email Settings - ${siteTitle}`;
  return (
    <VerifyLogin>
      <Header />

      <PageContent>
        <EmailSettingsPageContent />
      </PageContent>
      <Footer />
    </VerifyLogin>
  );
};

export default EmailSettings;
