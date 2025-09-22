import React from 'react';
import Header from '../../../Admin/Components/Header';
import Footer from '../../../Admin/Components/Footer';
import PluginPageContent from './Components/PluginPageContent.jsx';
import Sidebar from '../../../Admin/Components/Sidebar.jsx';

const AdminColumnsPluginPage = ({ siteTitle }) => {
  document.title = `Admin Columns - ${siteTitle}`;
  return (
    <>
      <Header />

      <div className="page-content-no-padding">
        <Sidebar />
        <div className="page-content-main-no-padding">
          <PluginPageContent />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminColumnsPluginPage;
