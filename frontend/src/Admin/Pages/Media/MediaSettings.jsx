import React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import MediaSettingsPageContent from '../../Components/Media/MediaSettingsPageContent.jsx';

const MediaSettings = ({ siteTitle }) => {
  document.title = `Media Settings - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <MediaSettingsPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default MediaSettings;
