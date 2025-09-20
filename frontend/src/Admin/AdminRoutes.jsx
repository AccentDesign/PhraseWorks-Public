import React, { lazy, Suspense, useEffect, useState, useContext } from 'react';
import { Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import LZString from 'lz-string';
import Loading from './Components/Loading';
import Notification from '../Utils/Notification';
import { get_site_title } from '../Includes/Functions';
import { APIConnectorContext } from '../Contexts/APIConnectorContext';
import { APIGetAdminPages } from '../API/APISystem';
import ErrorBoundary from '../Components/ErrorBoundary';
const SEOSettings = lazy(() => import('./Pages/Settings/SEOSettings'));
import { UserContext } from '../Contexts/UserContext';
import { getWebSocket } from '../Includes/WebSocketClient';
import { handleComponentError } from '../Utils/ErrorHandler';

window.React = React;

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
const CustomFields = lazy(() => import('./Pages/Settings/CustomFields'));
const CustomFieldGroupNew = lazy(() => import('./Pages/Settings/CustomFieldGroupNew'));
const CustomFieldGroupEdit = lazy(() => import('./Pages/Settings/CustomFieldGroupEdit'));

const Tools = lazy(() => import('./Pages/Tools/Tools'));
const CronEvents = lazy(() => import('./Pages/Tools/CronEvents'));

const CustomPosts = lazy(() => import('./Pages/Settings/CustomPosts'));
const CustomPostsNew = lazy(() => import('./Pages/Settings/CustomPostsNew'));
const CustomPostsEdit = lazy(() => import('./Pages/Settings/CustomPostsEdit'));

const CustomPostDashboard = lazy(() => import('./Pages/CustomPosts/CustomPostDashboard'));
const CustomPostNew = lazy(() => import('./Pages/CustomPosts/CustomPostNew'));
const CustomPostEdit = lazy(() => import('./Pages/CustomPosts/CustomPostEdit'));

const Comments = lazy(() => import('./Pages/Comments'));

const Users = lazy(() => import('./Pages/Users/Users'));
const UsersAdd = lazy(() => import('./Pages/Users/UsersAdd'));
const UsersEdit = lazy(() => import('./Pages/Users/UsersEdit'));
const Plugins = lazy(() => import('./Pages/Plugins'));

const Docs = lazy(() => import('./Pages/Docs'));
const Help = lazy(() => import('./Pages/Help'));

const componentsMap = {
  Dashboard,
  Docs,
  Help,
  Plugins,
  Comments,
  Posts,
  PostsCategories,
  PostsTags,
  PostsAdd,
  PostsEdit,
  Pages,
  PagesCategories,
  PagesTags,
  PagesAdd,
  PagesEdit,
  PageTemplates,
  Media,
  MediaSettings,
  Users,
  UsersAdd,
  UsersEdit,
  AppearanceThemes,
  AppearanceMenus,
  Settings,
  ReadingSettings,
  WritingSettings,
  EmailSettings,
  Tools,
  CronEvents,
  CustomFields,
  CustomFieldGroupNew,
  CustomFieldGroupEdit,
  CustomPosts,
  CustomPostsNew,
  CustomPostsEdit,
  CustomPostDashboard,
  CustomPostNew,
  CustomPostEdit,
  SEOSettings,
  Outlet,
};

const SITE_TITLE_CACHE_KEY = 'app:siteTitle';
const ADMIN_ROUTES_CACHE_KEY = 'app:adminRoutes';

const pluginComponentsGlob = import.meta.glob('../Plugins/**/Pages/*.jsx');

const AdminRoutes = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [pages, setPages] = useState(() => {
    const cached = localStorage.getItem(ADMIN_ROUTES_CACHE_KEY);
    return cached ? JSON.parse(LZString.decompressFromUTF16(cached)) : null;
  });
  const [pluginComponents, setPluginComponents] = useState({});
  const [siteTitle, setSiteTitle] = useState(localStorage.getItem(SITE_TITLE_CACHE_KEY) || '');
  const [pluginsReady, setPluginsReady] = useState(false);

  useEffect(() => {
    if (!user) return;
    const allowedRoles = ['administrator', 'author', 'editor'];
    const role = user.user_role?.role;

    if (role && !allowedRoles.includes(role)) {
      if (window.location.pathname !== '/') {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const loadSiteTitle = async (isMounted) => {
    try {
      if (!siteTitle) {
        const title = await get_site_title();
        if (isMounted && title) {
          localStorage.setItem(SITE_TITLE_CACHE_KEY, title);
          setSiteTitle(title);
        }
      }
    } catch (err) {
      await handleComponentError(err, 'AdminRoutes', 'loadSiteTitle');
    }
  };

  const flattenPages = (pagesArray = []) =>
    pagesArray.reduce((acc, page) => {
      acc.push(page);
      if (page.children && page.children.length > 0) {
        acc.push(...flattenPages(page.children));
      }
      return acc;
    }, []);

  const loadAdminPages = async (isMounted) => {
    try {
      const data = await APIGetAdminPages(loginPassword);
      if (isMounted && data.status === 200) {
        const parsedPages = JSON.parse(data.data.getAdminPages);
        const compressed = LZString.compressToUTF16(JSON.stringify(parsedPages));
        localStorage.setItem(ADMIN_ROUTES_CACHE_KEY, compressed);
        setPages(parsedPages);
        return parsedPages; // return pages
      }
    } catch (err) {
      await handleComponentError(err, 'AdminRoutes', 'loadAdminPages');
    }
  };

  const loadPluginPages = async (pagesToLoad, isMounted) => {
    const pluginPages = flattenPages(pagesToLoad).filter((p) => p.core === false);
    const pluginCompMap = {};
    for (const page of pluginPages) {
      const { element, elementLocation, key } = page;
      const matchPath = Object.keys(pluginComponentsGlob).find((globPath) =>
        globPath.includes(`Plugins/${elementLocation}/${element}`),
      );

      if (!matchPath) {
        console.error(`Plugin component not found: Plugins/${elementLocation}/${element}`);
        continue;
      }

      try {
        pluginCompMap[key] = lazy(pluginComponentsGlob[matchPath]);
      } catch (err) {
        await handleComponentError(err, 'AdminRoutes', 'loadPluginComponent', {
          additionalData: { pluginKey: key, elementLocation, element }
        });
      }
    }

    if (isMounted) setPluginComponents(pluginCompMap);
  };

  useEffect(() => {
    let isMounted = true;
    const scriptElements = [];

    fetch('/plugins.json')
      .then((res) => res.json())
      .then((plugins) => {
        const promises = plugins
          .filter((plugin) => plugin.src && plugin.src.trim() !== '')
          .map(
            (plugin) =>
              new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = plugin.src;
                script.async = true;
                script.onload = resolve;
                script.onerror = reject;
                document.body.appendChild(script);
                scriptElements.push(script);
              }),
          );

        Promise.all(promises).then(() => {
          if (isMounted) setPluginsReady(true);
        });
      });

    return () => {
      isMounted = false;
      scriptElements.forEach((script) => document.body.removeChild(script));
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      let adminPages = pages;
      if (!adminPages) {
        await loadSiteTitle(isMounted);
        adminPages = await loadAdminPages(isMounted);
      }
      if (adminPages) {
        await loadPluginPages(adminPages, isMounted);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [pages]);

  useEffect(() => {
    const ws = getWebSocket();
    if (!ws) return;

    const handleMessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'UPDATE_ADMIN_PAGES') {
          await loadAdminPages();
        }
      } catch (err) {
        await handleComponentError(err, 'AdminRoutes', 'handleWebSocketMessage');
      }
    };

    ws.addEventListener('message', handleMessage);
    return () => ws.removeEventListener('message', handleMessage);
  }, []);

  const generateRoutes = (routes) =>
    routes.map((route) => {
      const { key, path, index, element, children, core } = route;

      const routeProps = {};
      if (path) routeProps.path = path;
      if (index) routeProps.index = true;

      let Component = core === false ? pluginComponents[key] : componentsMap[element];
      if (!Component) Component = Outlet;

      const RouteElement =
        Component === Outlet
          ? Outlet
          : () => (
              <ErrorBoundary context={core === false ? 'plugin' : 'admin'}>
                <Suspense fallback={<Loading />}>
                  <Component siteTitle={siteTitle} />
                </Suspense>
              </ErrorBoundary>
            );

      return (
        <Route key={key} {...routeProps} element={<RouteElement />}>
          {children && children.length > 0 ? generateRoutes(children) : null}
        </Route>
      );
    });

  if (!pluginsReady || !pages) {
    return <div>Loading admin…</div>;
  }

  return (
    <ErrorBoundary context="admin">
      <Suspense fallback={<Loading />}>
        <Notification />
        <Routes>{generateRoutes(pages)}</Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AdminRoutes;
