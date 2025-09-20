import React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import AppearanceMenusPageContent from '../../Components/Appearance/AppearanceMenus.jsx';

const AppearanceMenus = ({ siteTitle }) => {
  document.title = `Menus - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <AppearanceMenusPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default AppearanceMenus;
