import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import PagesEditPageContent from '../../Components/Pages/PagesEditPageContent.jsx';
import { useState } from 'react';
import { get_post_by } from '../../../Includes/Posts.js';
import { useEffect } from 'react';

const PagesEdit = ({ siteTitle }) => {
  document.title = `Edit Page - ${siteTitle}`;
  const { id } = useParams();

  const [page, setPage] = useState(null);

  const fetchPageData = async () => {
    const data = await get_post_by('id', id);
    if (data != null) {
      setPage(data);
    }
  };
  useEffect(() => {
    fetchPageData();
  }, []);

  return (
    <>
      <Header page={page} />

      <PageContent>
        <PagesEditPageContent id={id} p={page} />
      </PageContent>
      <Footer />
    </>
  );
};

export default PagesEdit;
