import React from 'react';
import Header from '../../../Admin/Components/Header';
import Footer from '../../../Admin/Components/Footer';
import FormEntryPageContent from './Components/FormEntryPageContent.jsx';
import Sidebar from '../../../Admin/Components/Sidebar.jsx';

const ZeroGFormEntriesPage = ({ siteTitle }) => {
  document.title = `ZeroG Entries - ${siteTitle}`;
  return (
    <>
      <Header />

      <div className="page-content-no-padding">
        <Sidebar />
        <div className="page-content-main-no-padding">
          <FormEntryPageContent />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ZeroGFormEntriesPage;
