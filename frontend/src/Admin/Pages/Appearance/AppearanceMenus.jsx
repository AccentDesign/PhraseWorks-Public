import React from 'react';
import VerifyLogin from '../../../VerifyLogin';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import AppearanceMenusPageContent from '../../Components/Appearance/AppearanceMenus.jsx';

const AppearanceMenus = ({ siteTitle }) => {
  document.title = `Menus - ${siteTitle}`;
  return (
    <VerifyLogin>
      <Header />

      <PageContent>
        <AppearanceMenusPageContent />
      </PageContent>
      <Footer />
    </VerifyLogin>
  );
};

export default AppearanceMenus;
