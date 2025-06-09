import React, { useEffect, useState } from 'react';
import { FaPowerOff } from 'react-icons/fa';
import { Link, NavLink, useLocation } from 'react-router-dom';

const HeaderMenu = ({ mobileExpanded, setMobileExpanded, setOpen }) => {
  const location = useLocation();
  const { pathname } = useLocation();
  const isActiveHome = (path) => location.pathname === path;

  const [activeLink, setActiveLink] = useState('underline underline-offset-4');

  const handleResize = () => {
    if (window.innerWidth >= 768 && mobileExpanded == true) {
      setMobileExpanded(false);
    }
  };

  useEffect(() => {
    if (mobileExpanded == true) {
      setActiveLink('underline underline-offset-4');
    } else {
      setActiveLink('border-b-4');
    }
  }, [mobileExpanded]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <ul className={`flex ${'flex-col pt-4 pb-4 px-6'} space-y-4 text-sm font-medium`}>
        {/* <li className="">
          <NavLink
            to="/slug"
            className={({ isActive }) =>
              `text-white text-lg hover:text-white/50 ${
                isActive || pathname === '/slug' || pathname.startsWith('/slug')
                  ? 'active font-bold underline underline-offset-[0.5rem]'
                  : ''
              }`
            }
          >
            Slug
          </NavLink>
        </li> */}
        <li>
          <div className="flex flex-row">
            <a
              onClick={(e) => {
                e.preventDefault();
                LogoutUser();
              }}
              className="cursor-pointer text-white text-lg mr-1"
            >
              Logout
            </a>
            <a
              onClick={(e) => {
                e.preventDefault();
                LogoutUser();
              }}
              className="cursor-pointer link-special text-dark-teal bg-white ml-2 w-6 h-6 flex items-center justify-center rounded-full"
            >
              <FaPowerOff />
            </a>
          </div>
        </li>
      </ul>
    </>
  );
};

export default HeaderMenu;
