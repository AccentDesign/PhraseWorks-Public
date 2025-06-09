import React, { useContext } from 'react';
import { UserContext } from '../../Contexts/UserContext';
import { useLocation } from 'react-router-dom';
import { MdDashboard } from 'react-icons/md';

import { FaPenAlt } from 'react-icons/fa';
import { IoIosDocument } from 'react-icons/io';
import { MdPermMedia } from 'react-icons/md';
import { FaUser } from 'react-icons/fa';
import { FaTools } from 'react-icons/fa';
import { FaBrush } from 'react-icons/fa6';

import { Link } from 'react-router-dom';

const Sidebar = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const path = location.pathname;
  const isActive = (matchPath) => {
    return path === matchPath || path.startsWith(matchPath + '/');
  };
  return (
    <aside
      id="default-sidebar"
      className="fixed top-[40px] left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
      aria-label="Sidenav"
    >
      <div className="overflow-y-auto py-5 px-3 h-full border-r border-gray-200 bg-gray-800 text-white">
        <ul className="space-y-2">
          <li
            className={`w-full relative group flex flex-row items-center cursor-pointer ${
              path === '/admin/' || path === '/admin'
                ? 'border-l-4 border-blue-500 bg-gray-700'
                : ''
            }`}
          >
            <Link
              to="/admin/"
              className="w-full flex items-center p-2 text-base font-normal rounded-lg text-white hover:bg-gray-700 group"
            >
              <MdDashboard className="text-gray-400 group-hover:text-white" />

              <span className="ml-3">Dashboard</span>
            </Link>
          </li>
          <li
            className={`w-full relative group flex flex-row items-center cursor-pointer ${
              isActive('/admin/posts') ? 'border-l-4 border-blue-500 bg-gray-700' : ''
            }`}
          >
            <div className="w-full relative group flex flex-row items-center cursor-pointer">
              <Link
                to="/admin/posts"
                className="w-full flex items-center p-2 text-base font-normal rounded-lg text-white hover:bg-gray-700 group"
              >
                <FaPenAlt className="text-gray-400 group-hover:text-white" />
                <span className="flex-1 ml-3 text-left whitespace-nowrap">Posts</span>
              </Link>
              <div
                className="fixed z-50 top-[65px] left-[200px] z-50 w-56 text-base list-none bg-gray-800 text-white rounded divide-y divide-gray-100 shadow invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto"
                id="dropdown"
              >
                <ul className="py-1 font-light text-gray-400" aria-labelledby="dropdown">
                  <li>
                    <Link
                      to="/admin/posts"
                      className="block py-2 px-4 text-sm hover:bg-gray-600 text-gray-400 hover:text-white text-left"
                    >
                      All Posts
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/posts/new"
                      className="block py-2 px-4 text-sm hover:bg-gray-600 text-gray-400 hover:text-white text-left"
                    >
                      Add Post
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/posts/categories"
                      className="block py-2 px-4 text-sm hover:bg-gray-600 text-gray-400 hover:text-white text-left"
                    >
                      Categories
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/admin/posts/tags"
                      className="block py-2 px-4 text-sm hover:bg-gray-600 text-gray-400 hover:text-white text-left"
                    >
                      Tags
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li
            className={`w-full relative group flex flex-row items-center cursor-pointer ${
              isActive('/admin/media') ? 'border-l-4 border-blue-500 bg-gray-700' : ''
            }`}
          >
            <div className="w-full relative group flex flex-row items-center cursor-pointer">
              <Link
                to="/admin/media"
                className="w-full flex items-center p-2 text-base font-normal rounded-lg text-white hover:bg-gray-700 group"
              >
                <MdPermMedia className="text-gray-400 group-hover:text-white" />

                <span className="flex-1 ml-3 text-left whitespace-nowrap">Media</span>
              </Link>
              <div
                className="fixed z-50 top-[115px] left-[200px] z-50 w-56 text-base list-none bg-gray-800 text-white rounded divide-y divide-gray-100 shadow invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto"
                id="dropdown"
              >
                <ul className="py-1 font-light text-gray-400" aria-labelledby="dropdown">
                  <li>
                    <Link
                      to="/admin/media"
                      className="block py-2 px-4 text-sm hover:bg-gray-600 text-gray-400 hover:text-white text-left"
                    >
                      Media Library
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/media/settings"
                      className="block py-2 px-4 text-sm hover:bg-gray-600 text-gray-400 hover:text-white text-left"
                    >
                      Media Settings
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li
            className={`w-full relative group flex flex-row items-center cursor-pointer ${
              isActive('/admin/pages') ? 'border-l-4 border-blue-500 bg-gray-700' : ''
            }`}
          >
            <div className="w-full relative group flex flex-row items-center cursor-pointer">
              <Link
                to="/admin/pages"
                className="w-full flex items-center p-2 text-base font-normal rounded-lg text-white hover:bg-gray-700 group"
              >
                <IoIosDocument className="text-gray-400 group-hover:text-white" />

                <span className="flex-1 ml-3 text-left whitespace-nowrap">Pages</span>
              </Link>
              <div
                className="fixed z-50 top-[160px] left-[200px] z-50 w-56 text-base list-none bg-gray-800 text-white rounded divide-y divide-gray-100 shadow invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto"
                id="dropdown"
              >
                <ul className="py-1 font-light text-gray-400" aria-labelledby="dropdown">
                  <li>
                    <Link
                      to="/admin/pages"
                      className="block py-2 px-4 text-sm hover:bg-gray-600 text-gray-400 hover:text-white text-left"
                    >
                      All Pages
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/pages/new"
                      className="block py-2 px-4 text-sm hover:bg-gray-600 text-gray-400 hover:text-white text-left"
                    >
                      Add Page
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/pages/page_templates"
                      className="block py-2 px-4 text-sm hover:bg-gray-600 text-gray-400 hover:text-white text-left"
                    >
                      Page Templates
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li
            className={`w-full relative group flex flex-row items-center cursor-pointer ${
              isActive('/admin/users') ? 'border-l-4 border-blue-500 bg-gray-700' : ''
            }`}
          >
            <div className="w-full relative group flex flex-row items-center cursor-pointer">
              <Link
                to="/admin/users"
                className="w-full flex items-center p-2 text-base font-normal rounded-lg text-white hover:bg-gray-700 group"
              >
                <FaUser className="text-gray-400 group-hover:text-white" />

                <span className="flex-1 ml-3 text-left whitespace-nowrap">Users</span>
              </Link>
              <div
                className="fixed z-50 top-[212px] left-[200px] z-50 w-56 text-base list-none bg-gray-800 text-white rounded divide-y divide-gray-100 shadow invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto"
                id="dropdown"
              >
                <ul className="py-1 font-light text-gray-400" aria-labelledby="dropdown">
                  <li>
                    <Link
                      to="/admin/users"
                      className="block py-2 px-4 text-sm hover:bg-gray-600 text-gray-400 hover:text-white text-left"
                    >
                      All Users
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/users/new"
                      className="block py-2 px-4 text-sm hover:bg-gray-600 text-gray-400 hover:text-white text-left"
                    >
                      Add User
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/admin/users/edit/${user.id}`}
                      className="block py-2 px-4 text-sm hover:bg-gray-600 text-gray-400 hover:text-white text-left"
                    >
                      Profile
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li
            className={`w-full relative group flex flex-row items-center cursor-pointer ${
              isActive('/admin/appearance') ? 'border-l-4 border-blue-500 bg-gray-700' : ''
            }`}
          >
            <div className="w-full relative group flex flex-row items-center cursor-pointer">
              <Link
                to="/admin/appearance"
                className="w-full flex items-center p-2 text-base font-normal rounded-lg text-white hover:bg-gray-700 group"
              >
                <FaBrush className="text-gray-400 group-hover:text-white" />

                <span className="flex-1 ml-3 text-left whitespace-nowrap">Appearance</span>
              </Link>
              <div
                className="fixed z-50 top-[260px] left-[200px] z-50 w-56 text-base list-none bg-gray-800 text-white rounded divide-y divide-gray-100 shadow invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto"
                id="dropdown"
              >
                <ul className="py-1 font-light text-gray-400" aria-labelledby="dropdown">
                  <li>
                    <Link
                      to="/admin/appearance"
                      className="block py-2 px-4 text-sm hover:bg-gray-600 text-gray-400 hover:text-white text-left"
                    >
                      Themes
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/appearance/menus"
                      className="block py-2 px-4 text-sm hover:bg-gray-600 text-gray-400 hover:text-white text-left"
                    >
                      Menus
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li
            className={`w-full relative group flex flex-row items-center cursor-pointer ${
              isActive('/admin/settings') ? 'border-l-4 border-blue-500 bg-gray-700' : ''
            }`}
          >
            <div className="w-full relative group flex flex-row items-center cursor-pointer">
              <Link
                to="/admin/settings"
                className="w-full flex items-center p-2 text-base font-normal rounded-lg text-white hover:bg-gray-700 group"
              >
                <FaTools className="text-gray-400 group-hover:text-white" />

                <span className="flex-1 ml-3 text-left whitespace-nowrap">Settings</span>
              </Link>
              <div
                className="fixed z-50 top-[308px] left-[200px] z-50 w-56 text-base list-none bg-gray-800 text-white rounded divide-y divide-gray-100 shadow invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto"
                id="dropdown"
              >
                <ul className="py-1 font-light text-gray-400" aria-labelledby="dropdown">
                  <li>
                    <Link
                      to="/admin/settings"
                      className="block py-2 px-4 text-sm hover:bg-gray-600 text-gray-400 hover:text-white text-left"
                    >
                      General
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/settings/writing"
                      className="block py-2 px-4 text-sm hover:bg-gray-600 text-gray-400 hover:text-white text-left"
                    >
                      Writing
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/settings/reading"
                      className="block py-2 px-4 text-sm hover:bg-gray-600 text-gray-400 hover:text-white text-left"
                    >
                      Reading
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/admin/settings/email"
                      className="block py-2 px-4 text-sm hover:bg-gray-600 text-gray-400 hover:text-white text-left"
                    >
                      Email
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </ul>

        <ul className="pt-5 mt-5 space-y-2 border-t border-gray-200 dark:border-gray-700">
          <li>
            <a
              href="#"
              className="flex items-center p-2 text-base font-normal rounded-lg transition duration-75 hover:bg-gray-700 text-white group"
            >
              <svg
                aria-hidden="true"
                className="flex-shrink-0 w-6 h-6 transition duration-75 text-gray-400 group-hover:text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="ml-3">Docs</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center p-2 text-base font-normal rounded-lg transition duration-75 hover:bg-gray-700 text-white group"
            >
              <svg
                aria-hidden="true"
                className="flex-shrink-0 w-6 h-6 transition duration-75 text-gray-400 group-hover:text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="ml-3">Help</span>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
