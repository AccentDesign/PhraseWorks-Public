import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { UserContext } from '@/Contexts/UserContext';
import HeaderMenu from './HeaderMenu';
import { get_menu_by_name } from '@/Includes/Functions';

const Header = () => {
  const { user, LogoutUser } = useContext(UserContext);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const location = useLocation();
  const { pathname } = useLocation();
  const currentPath = location.pathname;
  const [menu, setMenu] = useState([]);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const isActive = location.pathname === '/';

  const toggleNav = () => setNavbarOpen((prev) => !prev);

  const fetchMenu = async () => {
    const menuData = await get_menu_by_name('Test');
    setMenu({ name: menuData.name, data: JSON.parse(menuData.menuData) });
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    fetchMenu();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <div
        className={`z-[999] bg-black header border-gray-300 w-full fixed ${
          user?.user_role?.role == 'administrator' ||
          user?.user_role?.role == 'editor' ||
          user?.user_role?.role == 'contributor'
            ? 'top-[40px]'
            : 'top-0'
        } `}
      >
        <div className="w-full w-[calc(100%-2rem)] md:w-[calc(100%-12rem)] mx-auto">
          <div className="flex items-center">
            <nav className="w-full flex items-center">
              <a href="/" className="flex no-underline text-menuText mr-4">
                <img
                  src="/images/pw.svg"
                  width="100"
                  height="82"
                  srcSet="/images/pw.svg 1x, /images/pw.svg 2x"
                  className="max-w-[50px]"
                  alt="Logo Image"
                  loading="lazy"
                />
              </a>

              <ul className="hidden lg:flex items-center w-full">
                <li className="mr-auto">
                  <a href="/" className={`header-link ${isActive ? 'active-link' : ''}`}>
                    Home
                  </a>
                </li>
                {menu && <HeaderMenu menu={menu} mobile={navbarOpen} />}
              </ul>
            </nav>
            <div className="ml-2 flex flex-row items-center">
              {user &&
                user?.user_role?.role != 'administrator' &&
                user?.user_role?.role != 'editor' &&
                user?.user_role?.role != 'contributor' && (
                  <div className="avatar text-white rounded-wrapper-white-25 flex flex-row items-center border border-1 border-gray-500/50 rounded-full">
                    <span className="link-special text-white flex items-center justify-center w-6 h-6 rounded-full bg-gray-500/50 mr-2">
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
                    <span className="avatar-name mr-h whitespace-nowrap">
                      {user.first_name} {user.last_name}
                    </span>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        LogoutUser();
                      }}
                      aria-label="Power Off"
                      className="cursor-pointer link-special text-gray-500 bg-white ml-2 w-6 h-6 flex items-center justify-center rounded-full"
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
                )}
              <div className="lg:hidden flex items-center">
                {!navbarOpen && (
                  <>
                    <button
                      type="button"
                      id="mobile-menu-toggle"
                      aria-controls="mobile-navigation"
                      aria-expanded={navbarOpen}
                      aria-label={navbarOpen ? 'Close menu' : 'Open menu'}
                      onClick={toggleNav}
                      className="ml-4 hover:bg-gray-800"
                    >
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 512 512"
                        height="200px"
                        width="200px"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-12 h-12 text-white"
                      >
                        <path
                          fill="none"
                          strokeLinecap="round"
                          strokeMiterlimit="10"
                          strokeWidth="48"
                          d="M88 152h336M88 256h336M88 360h336"
                        ></path>
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {navbarOpen && (
        <aside
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className={`fixed inset-0 z-[9999] flex flex-col bg-menuPrimary bg-cover bg-center bg-no-repeat ~px-4/16 ${
            user?.user_role?.role == 'administrator' ||
            user?.user_role?.role == 'editor' ||
            user?.user_role?.role == 'contributor'
              ? 'mt-[40px]'
              : 'mt-0'
          } `}
        >
          <div className="flex flex-row items-center justify-between">
            <NavLink to="/" aria-label="Home" onClick={() => setNavbarOpen(false)}>
              <img
                src="/images/pw.svg"
                width="100"
                height="82"
                srcSet="/images/pw.svg 1x, /images/pw.svg 2x"
                className="max-w-[50px]"
                alt="Logo Image"
                loading="lazy"
              />
              <span className="sr-only">Home</span>
            </NavLink>
            <button
              type="button"
              id="mobile-menu-toggle"
              aria-controls="mobile-navigation"
              aria-expanded={navbarOpen}
              aria-label={navbarOpen ? 'Close menu' : 'Open menu'}
              onClick={toggleNav}
              className="hover:bg-gray-800"
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                height="200px"
                width="200px"
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-white"
              >
                <path
                  fill="none"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                  strokeWidth="48"
                  d="M88 152h336M88 256h336M88 360h336"
                ></path>
              </svg>
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col justify-between overflow-y-auto mt-4 scrollbar">
            <nav aria-label="Primary">
              <ul>
                <li className="mr-auto">
                  <a href="/" className={`header-link ${isActive ? 'active-link' : ''}`}>
                    Home
                  </a>
                </li>
                <HeaderMenu menu={menu} mobile={navbarOpen} />
              </ul>
            </nav>
          </div>
        </aside>
      )}
    </>
  );
};

export default Header;
