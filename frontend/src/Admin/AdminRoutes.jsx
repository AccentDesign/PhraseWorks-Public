import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import Loading from './Components/Loading';
import Notification from '../Utils/Notification';
import { get_site_title } from '../Utils/System';

const AdminRoutes = () => {
  const Dashboard = lazy(() => import('./Pages/Dashboard'));

  const Media = lazy(() => import('./Pages/Media/Media'));
  const MediaSettings = lazy(() => import('./Pages/Media/MediaSettings'));

  const Posts = lazy(() => import('./Pages/Posts/Posts'));
  const PostsCategories = lazy(() => import('./Pages/Posts/PostsCategories'));
  const PostsTags = lazy(() => import('./Pages/Posts/PostsTags'));
  const PostsAdd = lazy(() => import('./Pages/Posts/PostsAdd'));
  const PostsEdit = lazy(() => import('./Pages/Posts/PostsEdit'));

  const Pages = lazy(() => import('./Pages/Pages/Pages'));
  const PagesCategories = lazy(() => import('./Pages/Pages/PagesCategories'));
  const PagesTags = lazy(() => import('./Pages/Pages/PagesTags'));
  const PagesAdd = lazy(() => import('./Pages/Pages/PagesAdd'));
  const PagesEdit = lazy(() => import('./Pages/Pages/PagesEdit'));

  const PageTemplates = lazy(() => import('./Pages/PageTemplates/PageTemplates'));

  const AppearanceThemes = lazy(() => import('./Pages/Appearance/AppearanceThemes'));
  const AppearanceMenus = lazy(() => import('./Pages/Appearance/AppearanceMenus'));

  const Settings = lazy(() => import('./Pages/Settings/Settings'));
  const ReadingSettings = lazy(() => import('./Pages/Settings/ReadingSettings'));
  const WritingSettings = lazy(() => import('./Pages/Settings/WritingSettings'));
  const EmailSettings = lazy(() => import('./Pages/Settings/EmailSettings'));

  const Users = lazy(() => import('./Pages/Users/Users'));
  const UsersAdd = lazy(() => import('./Pages/Users/UsersAdd'));
  const UsersEdit = lazy(() => import('./Pages/Users/UsersEdit'));

  const [siteTitle, setSiteTitle] = useState('');

  const fetchData = async () => {
    const title = await get_site_title();
    setSiteTitle(title);
  };

  useEffect(() => {
    fetchData();
  });

  return (
    <Suspense fallback={<Loading />}>
      <Notification />
      <Routes>
        <Route path="/" index element={<Dashboard key="admin-dashboard" siteTitle={siteTitle} />} />
        <Route path="posts/*" element={<Outlet />}>
          <Route index element={<Posts key="admin-posts-dashboard" siteTitle={siteTitle} />} />
          <Route
            path="categories"
            element={<PostsCategories key="admin-post-categories" siteTitle={siteTitle} />}
          />
          <Route path="tags" element={<PostsTags key="admin-post-tags" siteTitle={siteTitle} />} />
          <Route path="new" element={<PostsAdd key="admin-post-new" siteTitle={siteTitle} />} />
          <Route
            path="edit/:id"
            element={<PostsEdit key="admin-post-edit" siteTitle={siteTitle} />}
          />
        </Route>
        <Route path="pages/*" element={<Outlet />}>
          <Route index element={<Pages key="admin-pages-dashboard" siteTitle={siteTitle} />} />
          <Route
            path="categories"
            element={<PagesCategories key="admin-page-categories" siteTitle={siteTitle} />}
          />
          <Route path="tags" element={<PagesTags key="admin-page-tags" siteTitle={siteTitle} />} />
          <Route path="new" element={<PagesAdd key="admin-page-new" siteTitle={siteTitle} />} />
          <Route
            path="edit/:id"
            element={<PagesEdit key="admin-page-edit" siteTitle={siteTitle} />}
          />
          <Route path="page_templates/*" element={<Outlet />}>
            <Route
              index
              element={<PageTemplates key="admin-page_template-dashboard" siteTitle={siteTitle} />}
            />
            {/* <Route path="add" element={<PageTemplatesEdit key="admin-page_template-add" />} /> */}
          </Route>
        </Route>
        <Route path="media/*" element={<Outlet />}>
          <Route index element={<Media key="admin-media-dashboard" siteTitle={siteTitle} />} />
          <Route
            path="settings"
            element={<MediaSettings key="admin-media-settings" siteTitle={siteTitle} />}
          />
        </Route>
        <Route path="users/*" element={<Outlet />}>
          <Route index element={<Users key="admin-users-dashboard" siteTitle={siteTitle} />} />
          <Route path="new" element={<UsersAdd key="admin-user-new" siteTitle={siteTitle} />} />
          <Route
            path="edit/:id"
            element={<UsersEdit key="admin-user-edit" siteTitle={siteTitle} />}
          />
        </Route>
        <Route path="appearance/*" element={<Outlet />}>
          <Route
            index
            element={<AppearanceThemes key="admin-appearance-themes" siteTitle={siteTitle} />}
          />
          <Route
            path="menus"
            element={<AppearanceMenus key="admin-menus-settings" siteTitle={siteTitle} />}
          />
        </Route>
        <Route path="settings/*" element={<Outlet />}>
          <Route
            index
            element={<Settings key="admin-settings-dashboard" siteTitle={siteTitle} />}
          />
          <Route
            path="reading"
            element={<ReadingSettings key="admin-settings-reading" siteTitle={siteTitle} />}
          />
          <Route
            path="writing"
            element={<WritingSettings key="admin-settings-writing" siteTitle={siteTitle} />}
          />
          <Route
            path="email"
            element={<EmailSettings key="admin-settings-email" siteTitle={siteTitle} />}
          />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;
