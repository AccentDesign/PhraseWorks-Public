import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import PageContent from '../Components/PageContent.jsx';
import PluginsPageContent from '../Components/PluginsPageContent.jsx';

const Plugins = ({ siteTitle }) => {
  document.title = `Plugins - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <PluginsPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default Plugins;
