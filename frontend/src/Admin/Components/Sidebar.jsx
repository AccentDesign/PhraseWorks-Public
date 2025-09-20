import React, { useContext, useEffect, useState, Fragment } from 'react';
import { UserContext } from '../../Contexts/UserContext';
import { useLocation, Link } from 'react-router-dom';
import { APIGetAdminMenus } from '../../API/APISystem';
import { APIConnectorContext } from '../../Contexts/APIConnectorContext';
import SidebarItem from './SidebarItem';
import { APIGetCustomPosts } from '../../API/APICustomPosts';
import { notify } from '../../Utils/Notification';
import { getWebSocket } from '../../Includes/WebSocketClient';
import { createSafeSvgMarkup } from '../../Utils/sanitizeHtml';
import { handleComponentError } from '../../Utils/ErrorHandler';

const ADMIN_SIDEBAR_CACHE_KEY = 'app:adminSidebar';

const Sidebar = () => {
  const { user } = useContext(UserContext);
  const { loginPassword } = useContext(APIConnectorContext);
  const location = useLocation();
  const path = location.pathname;
  const [menuData, setMenuData] = useState([]);

  const IconFromString = ({ svgString }) => (
    <span className="sidebar-icon" dangerouslySetInnerHTML={createSafeSvgMarkup(svgString)} />
  );

  const isActive = (matchPath) => path === matchPath || path.startsWith(matchPath + '/');

  const fetchData = async (isMounted = true) => {
    try {
      const [menuResp, postsResp] = await Promise.all([
        APIGetAdminMenus(loginPassword),
        APIGetCustomPosts(loginPassword),
      ]);

      if (menuResp.status !== 200 || postsResp.status !== 200) {
        notify('Failed to fetch admin data.', 'error');
        return [];
      }

      // Check for null data before accessing properties
      if (!menuResp.data || !menuResp.data.getAdminMenus) {
        await handleComponentError(
          new Error('getAdminMenus data is null or undefined'),
          'Sidebar',
          'fetchAdminData',
          { silent: true }
        );
        notify('Admin menus data is not available.', 'warning');
        return [];
      }

      if (!postsResp.data || !postsResp.data.getCustomPosts) {
        await handleComponentError(
          new Error('getCustomPosts data is null or undefined'),
          'Sidebar',
          'fetchAdminData',
          { silent: true }
        );
        notify('Custom posts data is not available.', 'warning');
        return [];
      }

      const menu = JSON.parse(menuResp.data.getAdminMenus);
      const customPosts = JSON.parse(postsResp.data.getCustomPosts);

      const customPostMenus = customPosts.map((post) => {
        const slug = post.name
          .replace(/[^\w\s]/gi, '')
          .replace(/\s+/g, '_')
          .toLowerCase();

        return {
          id: `customPost_${slug}`,
          name: post.name,
          slug: `/admin/custom/${slug}`,
          icon: `<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" class="text-gray-400 group-hover:text-white" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M497.94 74.17l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.75 18.75-49.15 0-67.91zm-246.8-20.53c-15.62-15.62-40.94-15.62-56.56 0L75.8 172.43c-6.25 6.25-6.25 16.38 0 22.62l22.63 22.63c6.25 6.25 16.38 6.25 22.63 0l101.82-101.82 22.63 22.62L93.95 290.03A327.038 327.038 0 0 0 .17 485.11l-.03.23c-1.7 15.28 11.21 28.2 26.49 26.51a327.02 327.02 0 0 0 195.34-93.8l196.79-196.79-82.77-82.77-84.85-84.85z"></path></svg>`,
          order: 1,
          children: [
            {
              id: `customPost_${slug}_dashboard`,
              name: `${post.name} Dashboard`,
              slug: `/admin/custom/${slug}`,
              icon: null,
              order: 1,
              children: [],
            },
            {
              id: `customPost_${slug}_new`,
              name: `Add New ${post.name}`,
              slug: `/admin/custom/${slug}/new`,
              icon: null,
              order: 2,
              children: [],
            },
            {
              id: `customPost_${slug}_edit`,
              name: `Edit ${post.name}`,
              slug: `/admin/custom/${slug}/edit/:id`,
              icon: null,
              order: 3,
              children: [],
            },
          ],
        };
      });

      const updatedMenu = menu.flatMap((section) =>
        section.id === 'posts' ? [section, ...customPostMenus] : [section],
      );

      if (isMounted) {
        setMenuData(updatedMenu);
        localStorage.setItem(ADMIN_SIDEBAR_CACHE_KEY, JSON.stringify(updatedMenu));
      }
      return updatedMenu;
    } catch (err) {
      await handleComponentError(err, 'Sidebar', 'fetchData', {
        additionalData: { loginPassword: !!loginPassword }
      });
      notify('Error fetching menu data.', 'error');
      return [];
    }
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      const cached = localStorage.getItem(ADMIN_SIDEBAR_CACHE_KEY);
      if (cached) {
        if (isMounted) setMenuData(JSON.parse(cached));
      } else {
        const data = await fetchData(isMounted);
        if (isMounted) setMenuData(data);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!menuData || menuData.length === 0) {
        await fetchData(isMounted);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [menuData]);

  useEffect(() => {
    const ws = getWebSocket();
    if (!ws) return;

    const handleMessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'UPDATE_ADMIN_SIDEBAR') {
          // WebSocket event received, refreshing admin sidebar menu
          await fetchData();
        }
      } catch (err) {
        await handleComponentError(err, 'Sidebar', 'handleWebSocketMessage');
      }
    };

    ws.addEventListener('message', handleMessage);
    return () => ws.removeEventListener('message', handleMessage);
  }, [loginPassword]);

  return (
    <aside id="default-sidebar" className="sidebar" aria-label="Sidenav">
      <div className="sidebar-content">
        <ul key={JSON.stringify(menuData)} className="space-y-2">
          {[...menuData]
            .sort((a, b) => a.order - b.order)
            .map((item, idx) => (
              <Fragment key={idx}>
                {item.id === 'dashboard' ? (
                  <li
                    className={`sidebar-content-li ${
                      isActive('/admin') &&
                      (location.pathname === '/admin' || location.pathname === '/admin/')
                        ? 'border-l-4 border-blue-500 bg-gray-700'
                        : ''
                    }`}
                  >
                    <Link to="/admin/" className="sidebar-content-li-link group">
                      <IconFromString svgString={item.icon} />
                      <span className="ml-3">Dashboard</span>
                    </Link>
                  </li>
                ) : (
                  <SidebarItem
                    key={item.id + '-' + JSON.stringify(item.children.map((c) => c.id))}
                    item={item}
                    user={user}
                    path={path}
                  />
                )}
              </Fragment>
            ))}
        </ul>

        <ul className="pt-5 mt-5 space-y-2 border-t border-gray-200">
          <li
            className={`sidebar-content-li ${
              isActive('/admin/docs') ? 'border-l-4 border-blue-500 bg-gray-700' : ''
            }`}
          >
            <Link
              to="/admin/docs"
              className="sidebar-content-li-link group flex items-center p-2 text-base font-normal rounded-lg transition duration-75 hover:bg-gray-700 text-white group"
            >
              <svg
                aria-hidden="true"
                className="flex-shrink-0 w-6 h-6 transition duration-75 text-gray-400 group-hover:text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="ml-3">Docs</span>
            </Link>
          </li>
          <li
            className={`sidebar-content-li ${
              isActive('/admin/help') ? 'border-l-4 border-blue-500 bg-gray-700' : ''
            }`}
          >
            <Link
              to="/admin/help"
              className="sidebar-content-li-link group flex items-center p-2 text-base font-normal rounded-lg transition duration-75 hover:bg-gray-700 text-white group"
            >
              <svg
                aria-hidden="true"
                className="flex-shrink-0 w-6 h-6 transition duration-75 text-gray-400 group-hover:text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="ml-3">Help</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
