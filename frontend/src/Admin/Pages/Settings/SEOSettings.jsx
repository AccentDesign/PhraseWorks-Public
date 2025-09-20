import React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import SEOSettingsPageContent from '../../Components/Settings/SEOSettingsPageContent.jsx';

const SEOSettings = ({ siteTitle }) => {
  document.title = `SEO Settings - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <SEOSettingsPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default SEOSettings;
