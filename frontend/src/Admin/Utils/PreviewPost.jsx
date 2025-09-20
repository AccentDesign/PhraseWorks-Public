import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { UserContextProvider } from '../../Contexts/UserContext';
import { APIGetTheme, APILogError } from '../../API/APISystem';
import { APIConnectorContextProvider } from '../../Contexts/APIConnectorContext';
import { MemoryRouter } from 'react-router-dom';
import { ShortcodesProvider } from '@/Includes/Shortcodes/ShortcodesProvider';

const PreviewPost = ({ post, content, featuredImage, title, categories }) => {
  const [pageComponent, setPageComponent] = useState(null);
  const pages = import.meta.glob('../../Content/*/Pages/Post.jsx');

  const featuredImageImageData = post?.featured_image_imagedata
    ? JSON.parse(post.featured_image_imagedata)
    : { alt: 'Default alt text' };

  const featuredImageMeta2 = {
    file: featuredImage?.filename,
    sizes: [{ slug: 'thumbnail', file: featuredImage?.filename }],
  };

  const categories2 =
    post?.categories && Array.isArray(post.categories)
      ? post.categories.map((cat) => ({ id: cat.id, name: cat.name }))
      : [];

  const mockFields = {
    'text-1': 'Sample Text',
    'text-area-1': 'This is a preview of a text area.',
    'range-1': 45,
    'number-1': 123,
    'email-1': 'preview@example.com',
    url: 'https://example.com',
    password: 'secret',
    'image-1': JSON.stringify({ filename: 'preview-image.jpg' }),
    'file-1': JSON.stringify({ filename: 'preview-file.pdf' }),
    'wysiwyg-1': JSON.stringify('<p>This is <strong>WYSIWYG</strong> content</p>'),
    'link-1': JSON.stringify({ post_title: 'Linked Page', post_name: 'linked-page' }),
    'post-object': JSON.stringify({ post_title: 'Sample Post', post_name: 'sample-post' }),
    'page-link-1': JSON.stringify({ post_title: 'Sample Page', post_name: 'sample-page' }),
    'relationship-1': JSON.stringify([
      { id: 1, post_title: 'Related 1', post_name: 'related-1' },
      { id: 2, post_title: 'Related 2', post_name: 'related-2' },
    ]),
  };

  const mockPageData = {
    id: 999,
    post_title: title || 'Preview Title',
    post_name: 'preview-post',
    post_date: new Date().toISOString(),
    post_author: { display_name: 'Preview Author' },
    post_content: content || '<p>This is a preview post content.</p>',
    featured_image_metadata: JSON.stringify(featuredImageMeta2),
    featured_image_id: featuredImage?.id || 1,
    featured_image_imagedata: JSON.stringify(featuredImageImageData),
    categories: categories2,
    fields: mockFields,
  };

  const fetchData = async () => {
    const activeData = await APIGetTheme();
    if (activeData.status === 200) {
      const theme = activeData.data.getTheme;
      const themePath = theme.location.replace(/^\//, '').replace(/\/$/, '');
      const key = `../../${themePath}/Pages/Post.jsx`;

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

  const openPreview = () => {
    if (!pageComponent) {
      alert('Page component not loaded yet.');
      return;
    }

    const popup = window.open('', '', 'width=1000,height=800');
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
      // Copy stylesheets from parent to popup
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

      const root = ReactDOM.createRoot(popup.document.getElementById('root'));
      root.render(
        <HelmetProvider>
          <APIConnectorContextProvider>
            <UserContextProvider>
              <ShortcodesProvider>
                <MemoryRouter>
                  {React.createElement(pageComponent, {
                    post: mockPageData,
                    fields: mockFields,
                  })}
                </MemoryRouter>
              </ShortcodesProvider>
            </UserContextProvider>
          </APIConnectorContextProvider>
        </HelmetProvider>,
      );
    };
  };

  return (
    <button type="button" className="secondary-btn" onClick={openPreview} disabled={!pageComponent}>
      Preview Changes
    </button>
  );
};

export default PreviewPost;
