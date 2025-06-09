import React, { useEffect, useState } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import PageContent from '../Components/PageContent.jsx';
import { get_page_template } from '../../../Utils/Posts.js';

const templates = import.meta.glob('../Templates/**/*.jsx');

const Page = () => {
  const [TemplateComponent, setTemplateComponent] = useState(null);
  const [template, setTemplate] = useState(null);
  document.title = 'Page';

  useEffect(() => {
    const fetchData = async () => {
      const data = await get_page_template();
      const templatePath = `../Templates/${data.name}/${data.file_name}`;
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
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gradient-to-b from-dark-teal from-20% to-mid-teal bg-fixed min-h-screen top-0 flex flex-col">
      {template != null ? (
        <TemplateComponent />
      ) : (
        <>
          <div className="pt-[5rem] lg:pt-[8rem] f-1">
            <Header />
            <PageContent>Page Content {template?.file_name}</PageContent>
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};

export default Page;
