import React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import CustomFieldsPageContent from '../../Components/Settings/CustomFieldsPageContent.jsx';

const CustomFields = ({ siteTitle }) => {
  document.title = `CustomFields - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <CustomFieldsPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default CustomFields;
