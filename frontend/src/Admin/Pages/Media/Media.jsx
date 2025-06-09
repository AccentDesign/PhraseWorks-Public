import React from 'react';
import VerifyLogin from '../../../VerifyLogin';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import MediaPageContent from '../../Components/Media/MediaPageContent.jsx';

const Media = ({ siteTitle }) => {
  document.title = `Media - ${siteTitle}`;
  return (
    <VerifyLogin>
      <Header />

      <PageContent>
        <MediaPageContent />
      </PageContent>
      <Footer />
    </VerifyLogin>
  );
};

export default Media;
