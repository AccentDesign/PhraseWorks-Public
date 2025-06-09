import React from 'react';
import { useParams } from 'react-router-dom';
import VerifyLogin from '../../../VerifyLogin';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import PagesEditPageContent from '../../Components/Pages/PagesEditPageContent.jsx';

const PagesEdit = ({ siteTitle }) => {
  document.title = `Edit Page - ${siteTitle}`;
  const { id } = useParams();
  return (
    <VerifyLogin>
      <Header />

      <PageContent>
        <PagesEditPageContent id={id} />
      </PageContent>
      <Footer />
    </VerifyLogin>
  );
};

export default PagesEdit;
