import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../../Contexts/UserContext';
import { get_menu_by_name } from '@/Includes/Functions';

const Header = () => {
  const { user, LogoutUser } = useContext(UserContext);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [navLinks, setNavLinks] = useState([]);

  const hasSpecialRole = ['administrator', 'editor', 'contributor'].includes(user?.user_role?.role);

  const fetchMenu = async () => {
    const menuData = await get_menu_by_name('Test');
    const data = JSON.parse(menuData.menuData);
    data.unshift({
      id: '0',
      label: 'home',
      parentId: null,
      postId: null,
      title: 'Home',
      type: 'page',
      url: '/',
    });
    setNavLinks({ name: menuData.name, data: data });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);

    fetchMenu();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`mb-[40px]`}>
      <nav
        className={`fixed top-0 left-0 bg-menu-primary w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
          isScrolled
            ? 'bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4'
            : 'py-4 md:py-6'
        }
        ${hasSpecialRole ? 'top-[40px]' : 'top-0'}`}
      >
        <a href="/" className="flex items-center gap-2">
          <img
            src="/images/pw-full-whitetext.svg"
            className={`w-[220px] transition-all duration-500 ${isScrolled ? 'invert' : ''}`}
            alt="Logo Image"
            loading="lazy"
          />
        </a>

        <div className="hidden md:flex items-center gap-4 lg:gap-8">
          {navLinks?.data?.map((link, i) => {
            if (link.parentId == 'menuZone' || link.parentId == null)
              return (
                <a
                  key={i}
                  href={link.url}
                  className={`group flex flex-col gap-0.5 ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
                >
                  {link.title}
                  <div
                    className={`${
                      isScrolled ? 'bg-gray-700' : 'bg-white'
                    } h-0.5 w-0 group-hover:w-full transition-all duration-300`}
                  />
                </a>
              );
          })}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <button
              className={`px-8 py-2.5 rounded-full ml-4 transition-all duration-500 ${
                isScrolled ? 'text-white bg-black' : 'bg-white text-black'
              }`}
              onClick={(e) => {
                e.preventDefault();
                LogoutUser();
              }}
            >
              Logout
            </button>
          ) : (
            <a
              href="/login"
              className={`px-8 py-2.5 rounded-full ml-4 transition-all duration-500 ${
                isScrolled ? 'text-white bg-black' : 'bg-white text-black'
              }`}
            >
              Login
            </a>
          )}
        </div>

        <div className="flex items-center gap-3 md:hidden text-white">
          <svg
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`h-6 w-6 cursor-pointer ${isScrolled ? 'invert' : ''}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </div>

        <div
          className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-start justify-start pt-10 px-8 gap-6 font-medium text-gray-800 transition-all duration-500 ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } 
          ${isScrolled ? 'top-0' : hasSpecialRole ? 'top-[40px]' : 'top-0'}
          `}
        >
          <button className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)}>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {navLinks?.data?.map((link, i) => (
            <a
              key={i}
              href={link.url}
              onClick={() => setIsMenuOpen(false)}
              className={`${link.parentId != null && link.parentId != 'menuZone' && 'pl-4'}`}
            >
              {link.parentId != null && link.parentId != 'menuZone' && '- '}
              {link.title}
            </a>
          ))}
          {user ? (
            <button
              className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500"
              onClick={(e) => {
                e.preventDefault();
                LogoutUser();
              }}
            >
              Logout
            </button>
          ) : (
            <a
              href="/login"
              className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500"
            >
              Login
            </a>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;
