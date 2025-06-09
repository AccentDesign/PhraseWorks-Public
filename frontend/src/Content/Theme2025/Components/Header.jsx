import React, { useContext, useEffect, useState } from 'react';
import HeaderMenu from './HeaderMenu';
import { UserContext } from '../../../Contexts/UserContext';
import { FaUser, FaPowerOff } from 'react-icons/fa';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { get_menu_by_name } from '../../../Utils/System';

const Header = () => {
  const { user, LogoutUser } = useContext(UserContext);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const location = useLocation();
  const { pathname } = useLocation();
  const currentPath = location.pathname;
  const [menu, setMenu] = useState([]);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

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
  }, []);

  return (
    <>
      <div className="z-[999] bg-dark-teal border-gray-200 mb-4 w-full hidden lg:block fixed top-0">
        <div className="w-full md:w-[calc(100%-12rem)] mx-auto mt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <a href="/">
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

            {menu && <HeaderMenu menu={menu} />}
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
        </div>
      </div>
    </>
  );
};

export default Header;
