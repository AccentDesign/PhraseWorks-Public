import React from 'react';
import VerifyLogin from '../../../VerifyLogin';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import MediaSettingsPageContent from '../../Components/Media/MediaSettingsPageContent.jsx';

const MediaSettings = ({ siteTitle }) => {
  document.title = `Media Settings - ${siteTitle}`;
  return (
    <VerifyLogin>
      <Header />

      <PageContent>
        <MediaSettingsPageContent />
      </PageContent>
      <Footer />
    </VerifyLogin>
  );
};

export default MediaSettings;
