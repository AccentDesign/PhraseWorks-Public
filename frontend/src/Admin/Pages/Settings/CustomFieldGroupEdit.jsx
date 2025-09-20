import React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import CustomFieldsGroupsEditPageContent from '../../Components/Settings/CustomFieldsGroupsEditPageContent.jsx';

const CustomFieldGroupEdit = ({ siteTitle }) => {
  document.title = `CustomFields - Groups - New - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <CustomFieldsGroupsEditPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default CustomFieldGroupEdit;
