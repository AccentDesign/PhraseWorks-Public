import React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import CustomFieldsGroupsNewPageContent from '../../Components/Settings/CustomFieldsGroupsNewPageContent.jsx';

const CustomFieldGroupNew = ({ siteTitle }) => {
  document.title = `CustomFields - Groups - New - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <CustomFieldsGroupsNewPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default CustomFieldGroupNew;
