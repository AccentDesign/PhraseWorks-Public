import React from 'react';
import Header from '../../../Admin/Components/Header';
import Footer from '../../../Admin/Components/Footer';
import PageContent from '../../../Admin/Components/PageContent.jsx';
import PluginPageContent from './Components/PluginPageContent.jsx';

const PluginS3UploadsPluginPage = ({ siteTitle }) => {
  document.title = `Dashboard - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <PluginPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default PluginS3UploadsPluginPage;
