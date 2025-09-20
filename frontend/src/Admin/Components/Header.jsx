import React, { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../../Contexts/UserContext';
import { Link } from 'react-router-dom';
import { APIConnectorContext } from '../../Contexts/APIConnectorContext';
import { APIClearCache } from '../../API/APISystem';

const Header = ({ page = null, post = null }) => {
  const { loginPassword } = useContext(APIConnectorContext);
  const { user, LogoutUser } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const origin = window.location.origin;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClearCache = async () => {
    try {
      console.log('loginPassword value:', loginPassword);
      const data = await APIClearCache(loginPassword, "all");
      console.log('Cache clear response:', data);
      if (data?.data?.clearCache?.success) {
        alert(`Cache cleared successfully! ${data.data.clearCache.message}`);
      } else {
        const errorMsg = data?.data?.clearCache?.message || 'Unknown error';
        alert('Failed to clear cache: ' + errorMsg);
      }
    } catch (err) {
      console.error('Error clearing cache:', err);
      alert('Error clearing cache');
    }
  };

  return (
    <div className="header-wrapper">
      <div className="flex-center-4">
        <button
          ref={buttonRef}
          className="sm:hidden text-white"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle Menu"
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 448 512"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
          >
            <path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path>
          </svg>
        </button>

        <img src="/images/pw.svg" className="w-8 h-8" alt="Logo" />
        <Link to="/" className="flex-center hover:text-gray-400">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
          >
            <path d="M256 19.27L25.637 249.638 19.27 256 32 268.73l6.363-6.367L256 44.727l217.637 217.636L480 268.73 492.73 256l-6.367-6.363zM96 48v107.273l64-64.002V48zm160 20.727l-192 192V486h64V320h96v166h224V260.727zM288 320h96v80h-96z"></path>
          </svg>
          <span className="ml-2 hidden sm:inline">Site</span>
        </Link>

        <div className="header-menu-items group">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 448 512"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
          >
            <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path>
          </svg>
          <span className="ml-2">Add</span>
          <div className="header-menu-hover-panel">
            <ul className="py-1 text-sm">
              <MenuItems />
            </ul>
          </div>
        </div>

        {(page != null || post != null) && (
          <Link
            to={`${origin}${page != null ? page.guid : post.guid}`}
            className="flex-center hover:text-gray-400"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 576 512"
              height="200px"
              width="200px"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
            >
              <path d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"></path>
            </svg>
            <span className="ml-2 hidden sm:inline">View</span>
          </Link>
        )}

        <button onClick={handleClearCache} className="text-white hover:text-gray-400">
          Purge Cache
        </button>
      </div>

      <div className="flex items-center">
        <span className="header-menu-user-icon">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 448 512"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
          >
            <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path>
          </svg>
        </span>
        <span className="avatar-name mr-h sm:inline">
          Hi {user.first_name} {user.last_name}
        </span>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            LogoutUser();
          }}
          className="header-menu-user-link"
          aria-label="Logout"
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
          >
            <path d="M400 54.1c63 45 104 118.6 104 201.9 0 136.8-110.8 247.7-247.5 248C120 504.3 8.2 393 8 256.4 7.9 173.1 48.9 99.3 111.8 54.2c11.7-8.3 28-4.8 35 7.7L162.6 90c5.9 10.5 3.1 23.8-6.6 31-41.5 30.8-68 79.6-68 134.9-.1 92.3 74.5 168.1 168 168.1 91.6 0 168.6-74.2 168-169.1-.3-51.8-24.7-101.8-68.1-134-9.7-7.2-12.4-20.5-6.5-30.9l15.8-28.1c7-12.4 23.2-16.1 34.8-7.8zM296 264V24c0-13.3-10.7-24-24-24h-32c-13.3 0-24 10.7-24 24v240c0 13.3 10.7 24 24 24h32c13.3 0 24-10.7 24-24z"></path>
          </svg>
        </a>
      </div>

      {menuOpen && (
        <div ref={menuRef} className="header-mobile-menu">
          <ul className="py-1 text-sm">
            <MenuItemsMobile />
          </ul>
        </div>
      )}
    </div>
  );
};

const MenuItems = () => (
  <>
    <li>
      <Link to="/admin/posts/new" className="header-menu-item">
        Posts
      </Link>
    </li>
    <li>
      <Link to="/admin/media" className="header-menu-item">
        Media
      </Link>
    </li>
    <li>
      <Link to="/admin/pages/new" className="header-menu-item">
        Pages
      </Link>
    </li>
    <li>
      <Link to="/admin/users/new" className="header-menu-item">
        Users
      </Link>
    </li>
  </>
);

const MenuItemsMobile = () => (
  <>
    <li>
      <Link to="/admin/" className="header-menu-item-link group">
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 24 24"
          height="200px"
          width="200px"
          xmlns="http://www.w3.org/2000/svg"
          className="header-menu-item-link-icon w-6 h-6"
        >
          <path fill="none" d="M0 0h24v24H0z"></path>
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"></path>
        </svg>
        <span className="ml-3">Dashboard</span>
      </Link>
    </li>
    <li>
      <Link to="/admin/posts" className="header-menu-item-link group">
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 512 512"
          height="200px"
          width="200px"
          xmlns="http://www.w3.org/2000/svg"
          className="header-menu-item-link-icon w-6 h-6"
        >
          <path d="M497.94 74.17l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.75 18.75-49.15 0-67.91zm-246.8-20.53c-15.62-15.62-40.94-15.62-56.56 0L75.8 172.43c-6.25 6.25-6.25 16.38 0 22.62l22.63 22.63c6.25 6.25 16.38 6.25 22.63 0l101.82-101.82 22.63 22.62L93.95 290.03A327.038 327.038 0 0 0 .17 485.11l-.03.23c-1.7 15.28 11.21 28.2 26.49 26.51a327.02 327.02 0 0 0 195.34-93.8l196.79-196.79-82.77-82.77-84.85-84.85z"></path>
        </svg>
        <span className="header-menu-item-link-span">Posts</span>
      </Link>
    </li>
    <li>
      <Link to="/admin/media" className="header-menu-item-link group">
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 24 24"
          height="200px"
          width="200px"
          xmlns="http://www.w3.org/2000/svg"
          className="header-menu-item-link-icon w-6 h-6"
        >
          <path fill="none" d="M0 0h24v24H0z"></path>
          <path d="M2 6H0v5h.01L0 20c0 1.1.9 2 2 2h18v-2H2V6zm20-2h-8l-2-2H6c-1.1 0-1.99.9-1.99 2L4 16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM7 15l4.5-6 3.5 4.51 2.5-3.01L21 15H7z"></path>
        </svg>
        <span className="header-menu-item-link-span">Media</span>
      </Link>
    </li>
    <li>
      <Link to="/admin/pages" className="header-menu-item-link group">
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 512 512"
          height="200px"
          width="200px"
          xmlns="http://www.w3.org/2000/svg"
          className="header-menu-item-link-icon w-6 h-6"
        >
          <path d="M312 155h91c2.8 0 5-2.2 5-5 0-8.9-3.9-17.3-10.7-22.9L321 63.5c-5.8-4.8-13-7.4-20.6-7.4-4.1 0-7.4 3.3-7.4 7.4V136c0 10.5 8.5 19 19 19z"></path>
          <path d="M267 136V56H136c-17.6 0-32 14.4-32 32v336c0 17.6 14.4 32 32 32h240c17.6 0 32-14.4 32-32V181h-96c-24.8 0-45-20.2-45-45z"></path>
        </svg>

        <span className="header-menu-item-link-span">Pages</span>
      </Link>
    </li>
    <li>
      <Link to="/admin/users" className="header-menu-item-link group">
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 448 512"
          height="200px"
          width="200px"
          xmlns="http://www.w3.org/2000/svg"
          className="header-menu-item-link-icon w-6 h-6"
        >
          <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path>
        </svg>

        <span className="header-menu-item-link-span">Users</span>
      </Link>
    </li>
    <li>
      <Link to="/admin/plugins" className="header-menu-item-link group">
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 16 16"
          height="200px"
          width="200px"
          xmlns="http://www.w3.org/2000/svg"
          className="header-menu-item-link-icon w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M1 8a7 7 0 1 1 2.898 5.673c-.167-.121-.216-.406-.002-.62l1.8-1.8a3.5 3.5 0 0 0 4.572-.328l1.414-1.415a.5.5 0 0 0 0-.707l-.707-.707 1.559-1.563a.5.5 0 1 0-.708-.706l-1.559 1.562-1.414-1.414 1.56-1.562a.5.5 0 1 0-.707-.706l-1.56 1.56-.707-.706a.5.5 0 0 0-.707 0L5.318 5.975a3.5 3.5 0 0 0-.328 4.571l-1.8 1.8c-.58.58-.62 1.6.121 2.137A8 8 0 1 0 0 8a.5.5 0 0 0 1 0"
          ></path>
        </svg>
        <span className="header-menu-item-link-span">Plugins</span>
      </Link>
    </li>
    <li>
      <Link to="/admin/appearance" className="header-menu-item-link group">
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 384 512"
          height="200px"
          width="200px"
          xmlns="http://www.w3.org/2000/svg"
          className="header-menu-item-link-icon w-6 h-6"
        >
          <path d="M352 0H32C14.33 0 0 14.33 0 32v224h384V32c0-17.67-14.33-32-32-32zM0 320c0 35.35 28.66 64 64 64h64v64c0 35.35 28.66 64 64 64s64-28.65 64-64v-64h64c35.34 0 64-28.65 64-64v-32H0v32zm192 104c13.25 0 24 10.74 24 24 0 13.25-10.75 24-24 24s-24-10.75-24-24c0-13.26 10.75-24 24-24z"></path>
        </svg>
        <span className="header-menu-item-link-span">Appearance</span>
      </Link>
    </li>
    <li>
      <Link to="/admin/settings" className="header-menu-item-link group">
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 512 512"
          height="200px"
          width="200px"
          xmlns="http://www.w3.org/2000/svg"
          className="header-menu-item-link-icon w-6 h-6"
        >
          <path d="M501.1 395.7L384 278.6c-23.1-23.1-57.6-27.6-85.4-13.9L192 158.1V96L64 0 0 64l96 128h62.1l106.6 106.6c-13.6 27.8-9.2 62.3 13.9 85.4l117.1 117.1c14.6 14.6 38.2 14.6 52.7 0l52.7-52.7c14.5-14.6 14.5-38.2 0-52.7zM331.7 225c28.3 0 54.9 11 74.9 31l19.4 19.4c15.8-6.9 30.8-16.5 43.8-29.5 37.1-37.1 49.7-89.3 37.9-136.7-2.2-9-13.5-12.1-20.1-5.5l-74.4 74.4-67.9-11.3L334 98.9l74.4-74.4c6.6-6.6 3.4-17.9-5.7-20.2-47.4-11.7-99.6.9-136.6 37.9-28.5 28.5-41.9 66.1-41.2 103.6l82.1 82.1c8.1-1.9 16.5-2.9 24.7-2.9zm-103.9 82l-56.7-56.7L18.7 402.8c-25 25-25 65.5 0 90.5s65.5 25 90.5 0l123.6-123.6c-7.6-19.9-9.9-41.6-5-62.7zM64 472c-13.2 0-24-10.8-24-24 0-13.3 10.7-24 24-24s24 10.7 24 24c0 13.2-10.7 24-24 24z"></path>
        </svg>

        <span className="header-menu-item-link-span">Settings</span>
      </Link>
    </li>
  </>
);

export default Header;
