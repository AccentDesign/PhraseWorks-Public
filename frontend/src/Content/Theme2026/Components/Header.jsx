import React, { useContext, useEffect, useState } from 'react';
import HeaderMenu from './HeaderMenu';
import { UserContext } from '../../../Contexts/UserContext';
import { FaUser, FaPowerOff } from 'react-icons/fa';
import { Link, NavLink, useLocation } from 'react-router-dom';

const Header = () => {
  const { user, LogoutUser } = useContext(UserContext);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const location = useLocation();
  const { pathname } = useLocation();
  const currentPath = location.pathname;

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div className="z-[999] bg-dark-teal border-gray-200 mb-4 w-full hidden lg:block fixed top-0">
        <div className="w-full md:w-[calc(100%-12rem)] mx-auto mt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <a href="#">
                <img
                  src="/images/pw.svg"
                  width="100"
                  height="82"
                  srcSet="/images/pw.svg 1x, /images/pw.svg 2x"
                  className="max-w-[100px]"
                  alt="Logo Image"
                  loading="lazy"
                />
              </a>
            </div>
            {user && (
              <div className="avatar text-white rounded-wrapper-white-25 flex flex-row items-center border border-1 border-gray-500/50 rounded-full">
                <span className="link-special text-white flex items-center justify-center w-6 h-6 rounded-full bg-gray-500/50 mr-2">
                  <FaUser />
                </span>
                <span className="avatar-name mr-h">
                  {user.first_name} {user.last_name}
                </span>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    LogoutUser();
                  }}
                  aria-label="Power Off"
                  className="cursor-pointer link-special text-dark-teal bg-white ml-2 w-6 h-6 flex items-center justify-center rounded-full"
                >
                  <FaPowerOff />
                </a>
              </div>
            )}
          </div>
          <nav>
            <ul className="w-full flex justify-between">
              {/* <li className="flex-1 text-center relative p-4">
                <NavLink
                  to="/slug"
                  className={({ isActive }) =>
                    `text-white text-xl hover:text-white/50 uppercase ${
                      isActive ||
                      pathname === '/slug' ||
                      pathname.startsWith('/slug')
                        ? 'active font-bold underline underline-offset-[0.5rem]'
                        : ''
                    }`
                  }
                >
                  Slug
                </NavLink>
              </li> */}
            </ul>
          </nav>
        </div>
      </div>
      <div className="z-[999] block lg:hidden w-full bg-dark-teal fixed top-0">
        <div className="flex flex-row py-4 justify-between items-start">
          <div className="flex items-center mx-4">
            <img src="/images/accent-logo-desktop-white.svg" />
          </div>
          <a
            href="#"
            className="flex flex-row items-center mr-4"
            onClick={(e) => {
              e.preventDefault();
              setMobileExpanded(!mobileExpanded);
            }}
          >
            {mobileExpanded ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="3.5"
                stroke="currentColor"
                className="w-4 h-4 text-white"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="3.5"
                stroke="currentColor"
                className="w-4 h-4 text-white"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            )}
            <span className="ml-1 text-white">Menu</span>
          </a>
        </div>
      </div>
      {mobileExpanded && (
        <>
          <div className="w-full border-1 border-b border-gray-300 bg-gradient-to-b from-dark-teal from-20% to-mid-teal bg-fixed top-0">
            {screenWidth < 1024 && (
              <HeaderMenu mobileExpanded={mobileExpanded} setMobileExpanded={setMobileExpanded} />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Header;
