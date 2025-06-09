import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Loading from '../Admin/Components/Loading';
import Notification from '../Utils/Notification';
import { APIGetTheme } from '../API/APISystem';
import { ThemeComponentLoader } from '../Utils/ThemeComponentLoader';
import Page from '../Utils/Page';

const MainRoutes = ({ posts }) => {
  const [components, setComponents] = useState(null);
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const fetchTheme = async () => {
      const data = await APIGetTheme();
      if (data.status == 200) {
        const comps = await ThemeComponentLoader(data.data.getTheme.name);
        setTheme(data.data.getTheme.name);
        setComponents(comps);
      }
    };
    fetchTheme();
  }, []);

  if (
    !components ||
    !components.HomePage ||
    !components.Page ||
    !components.Post ||
    !components.Login ||
    !components.Page404 ||
    !components.Author ||
    !components.Category
  ) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <Notification />
      <Routes>
        <Route exact path="/" element={<components.HomePage key="homepage" />} />
        {posts.map((post, idx) => {
          const isPage = post.post_type === 'page';
          const Component = isPage ? Page : components.Post;

          // For 'page' type, render the layout and inject PageContent
          const element = isPage ? (
            <Component PageContent={components.Page} post={post} theme={theme} />
          ) : (
            <Component post={post} />
          );

          return <Route key={idx} path={`/${post.post_name}`} element={element} />;
        })}
        <Route path={`/author/:id`} element={<components.Author />} />;
        <Route path={`/category/:categoryName`} element={<components.Category />} />;
        {/* Login route (accessible when not authenticated) */}
        <Route path="/login" element={<components.Login key="login" />} />
        <Route path="*" element={<components.Page404 />} />
      </Routes>
    </Suspense>
  );
};

export default MainRoutes;
