import React from 'react';
import VerifyLogin from '../../../VerifyLogin';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import SettingsPageContent from '../../Components/Settings/SettingsPageContent.jsx';

const Settings = ({ siteTitle }) => {
  document.title = `General Settings - ${siteTitle}`;
  return (
    <VerifyLogin>
      <Header />

      <PageContent>
        <SettingsPageContent />
      </PageContent>
      <Footer />
    </VerifyLogin>
  );
};

export default Settings;
