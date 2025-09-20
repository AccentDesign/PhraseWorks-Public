import React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import AppearanceThemesPageContent from '../../Components/Appearance/AppearanceThemes.jsx';

const AppearanceThemes = ({ siteTitle }) => {
  document.title = `Themes - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <AppearanceThemesPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default AppearanceThemes;
