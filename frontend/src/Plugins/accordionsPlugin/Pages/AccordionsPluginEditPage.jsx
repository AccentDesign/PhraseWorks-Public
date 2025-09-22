import React from 'react';
import Header from '../../../Admin/Components/Header';
import Footer from '../../../Admin/Components/Footer';
import PageContent from '../../../Admin/Components/PageContent.jsx';
import PluginPageEditContent from './Components/PluginPageEditContent.jsx';

const AccordionPluginEditPage = ({ siteTitle }) => {
  document.title = `Dashboard - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <PluginPageEditContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default AccordionPluginEditPage;
