import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { get_page_template, get_post_by, get_posts, get_slug } from '../Includes/Functions';
import { getCurrentPost } from './PostStore.js';
import { APILogError } from '../API/APISystem.js';

const templates = import.meta.glob(`../Content/*/Templates/**/*.jsx`);
const Page = ({ PageContent, theme }) => {
  const { post_name } = useParams();
  const [TemplateComponent, setTemplateComponent] = useState(null);
  const [template, setTemplate] = useState(null);
  const [pageData, setPageData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const perPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      const data = await get_page_template();
      if (data != null) {
        const templatePath = `../Content/${theme}/Templates/${data.name}/${data.file_name}`;
        const loader = templates[templatePath];

        if (!loader) {
          console.error('Template not found in build:', templatePath);
          return;
        }

        try {
          const mod = await loader();
          setTemplateComponent(() => mod.default);
          setTemplate(data);
        } catch (err) {
          await APILogError(err.stack || String(err));
          console.error('Error loading template component:', err);
        }
      } else {
        setPageData(getCurrentPost());
        const postsTmp = await get_posts(0, 8, 'post');
        setPosts(postsTmp.data);
        setTotal(postsTmp.total);
      }
    };

    fetchData();
  }, [post_name]);

  return (
    <>
      {template != null ? (
        <TemplateComponent />
      ) : (
        <PageContent
          pageData={pageData}
          posts={posts}
          total={total}
          page={page}
          perPage={perPage}
          setPage={setPage}
        />
      )}
    </>
  );
};

export default Page;
