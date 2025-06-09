import React from 'react';
import VerifyLogin from '../../../VerifyLogin';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import AppearanceThemesPageContent from '../../Components/Appearance/AppearanceThemes.jsx';

const AppearanceThemes = ({ siteTitle }) => {
  document.title = `Themes - ${siteTitle}`;
  return (
    <VerifyLogin>
      <Header />

      <PageContent>
        <AppearanceThemesPageContent />
      </PageContent>
      <Footer />
    </VerifyLogin>
  );
};

export default AppearanceThemes;
