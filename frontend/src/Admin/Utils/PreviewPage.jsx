import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { UserContextProvider } from '../../Contexts/UserContext';
import { APIGetTheme, APILogError } from '../../API/APISystem';
import { APIConnectorContextProvider } from '../../Contexts/APIConnectorContext';
import { MemoryRouter } from 'react-router-dom';

const PreviewPage = ({ post, content, featuredImage, title, categories }) => {
  const [pageComponent, setPageComponent] = useState(null);
  const pages = import.meta.glob('../../Content/*/Pages/Page.jsx');

  const featuredImageMeta = post?.featured_image_metadata
    ? JSON.parse(post.featured_image_metadata)
    : {
        file: 'default-image.jpg',
        sizes: [],
      };

  const featuredImageImageData = post?.featured_image_imagedata
    ? JSON.parse(post.featured_image_imagedata)
    : { alt: 'Default alt text' };

  const categories2 =
    post?.categories && Array.isArray(post.categories)
      ? post.categories.map((cat) => ({ id: cat.id, name: cat.name }))
      : [];
  const featuredImageMeta2 = {
    file: featuredImage?.filename,
    sizes: [{ slug: 'thumbnail', file: featuredImage?.filename }],
  };

  const mockPageData = {
    post_title: title || 'No title',
    post_date: post?.post_date || new Date().toISOString(),
    post_author: post?.post_author || null,
    post_content: content || '',
    featured_image_metadata: JSON.stringify(featuredImageMeta2),
    featured_image_id: featuredImage?.id || null,
    featured_image_imagedata: JSON.stringify(featuredImageImageData),
    categories: categories2,
  };

  const fetchData = async () => {
    const activeData = await APIGetTheme();
    if (activeData.status === 200) {
      const theme = activeData.data.getTheme;

      const themePath = theme.location.replace(/^\//, '').replace(/\/$/, '');

      const key = `../../${themePath}/Pages/Page.jsx`;

      if (!(key in pages)) {
        console.error('Theme page component not found:', key);
        return;
      }

      try {
        const pageModule = await pages[key]();
        setPageComponent(() => pageModule.default);
      } catch (err) {
        await APILogError(err.stack || String(err));
        console.error('Failed to load theme Page component:', err);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openPreview = (pageData) => {
    if (!pageComponent) {
      alert('Page component not loaded yet.');
      return;
    }

    const popup = window.open('', '', 'width=800,height=600');
    if (!popup) return;

    popup.document.write(`
      <html>
        <head>
          <title>Preview</title>
          <link rel="stylesheet" href="/path/to/tailwind.css" />
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>
    `);
    popup.document.close();

    popup.onload = async () => {
      const root = ReactDOM.createRoot(popup.document.getElementById('root'));

      for (const styleSheet of Array.from(document.styleSheets)) {
        try {
          if (styleSheet.href) {
            const link = popup.document.createElement('link');
            link.rel = 'stylesheet';
            link.href = styleSheet.href;
            popup.document.head.appendChild(link);
          } else if (styleSheet.cssRules) {
            const style = popup.document.createElement('style');
            let css = '';
            for (const rule of styleSheet.cssRules) {
              css += rule.cssText;
            }
            style.textContent = css;
            popup.document.head.appendChild(style);
          }
        } catch (err) {
          await APILogError(err.stack || String(err));
          console.warn('Could not access stylesheet:', err);
        }
      }

      root.render(
        <HelmetProvider>
          <APIConnectorContextProvider>
            <UserContextProvider>
              <MemoryRouter>
                {React.createElement(pageComponent, {
                  pageData: pageData,
                  posts: [],
                  total: 0,
                  page: 1,
                  perPage: 10,
                  setPage: () => {},
                })}
              </MemoryRouter>
            </UserContextProvider>
          </APIConnectorContextProvider>
        </HelmetProvider>,
      );
    };
  };

  return (
    <button
      type="button"
      className="secondary-btn"
      onClick={() => openPreview(mockPageData)}
      disabled={!pageComponent}
    >
      Preview Changes
    </button>
  );
};

export default PreviewPage;
