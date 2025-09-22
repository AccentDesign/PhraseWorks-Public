import React from 'react';
import Header from '../../../Admin/Components/Header';
import Footer from '../../../Admin/Components/Footer';
import EditPageContent from './Components/EditPageContent.jsx';
import Sidebar from '../../../Admin/Components/Sidebar.jsx';

const AdminColumnsPluginAddPage = ({ siteTitle }) => {
  document.title = `Admin Columns - Add - ${siteTitle}`;
  return (
    <>
      <Header />

      <div className="page-content-no-padding">
        <Sidebar />
        <div className="page-content-main-no-padding">
          <EditPageContent />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminColumnsPluginAddPage;
