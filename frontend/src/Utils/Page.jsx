import React, { useEffect, useState } from 'react';
import { get_page_template, get_post_by, get_posts, get_slug } from './Posts';

const templates = import.meta.glob(`../Content/*/Templates/**/*.jsx`);
const Page = ({ PageContent, theme }) => {
  const [TemplateComponent, setTemplateComponent] = useState(null);
  const [template, setTemplate] = useState(null);
  const [pageData, setPageData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(8);

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
        } catch (error) {
          console.error('Error loading template component:', error);
        }
      } else {
        const pageAsyncData = await get_post_by('post_name', get_slug());
        setPageData(pageAsyncData);
        const postsTmp = await get_posts(0, 20, 'post');
        setPosts(postsTmp.posts);
        setTotal(postsTmp.total);
      }
    };

    fetchData();
  }, []);
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
