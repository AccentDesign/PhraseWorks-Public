import React from 'react';
import VerifyLogin from '../../../VerifyLogin';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import ReadingSettingsPageContent from '../../Components/Settings/ReadingSettingsPageContent.jsx';

const ReadingSettings = ({ siteTitle }) => {
  document.title = `Reading Settings - ${siteTitle}`;
  return (
    <VerifyLogin>
      <Header />

      <PageContent>
        <ReadingSettingsPageContent />
      </PageContent>
      <Footer />
    </VerifyLogin>
  );
};

export default ReadingSettings;
