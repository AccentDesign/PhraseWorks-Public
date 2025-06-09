import React, { useContext } from 'react';
import { UserContext } from '../../Contexts/UserContext';
import { GiHouse } from 'react-icons/gi';
import { FaPlus } from 'react-icons/fa';
import { FaUser, FaPowerOff } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user, LogoutUser } = useContext(UserContext);

  return (
    <div className="w-full fixed z-50 h-[40px] bg-gray-800 text-white flex flex-row justify-between items-center px-4">
      <div className="flex flex-row items-center gap-4">
        <img src="/images/pw.svg" className="w-8 h-8" />
        <Link to="/" className="flex flex-row items-center cursor-pointer hover:text-gray-400">
          <GiHouse />
          <span className="ml-2">Site</span>
        </Link>
        <div className="relative group flex flex-row items-center cursor-pointer hover:text-gray-400">
          <FaPlus />
          <span className="ml-2">Add</span>

          <div
            className="absolute top-6 left-0 z-50 w-56 text-base list-none bg-gray-800 text-white rounded divide-y divide-gray-100 shadow invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto"
            id="dropdown"
          >
            <ul className="py-1 font-light text-gray-400" aria-labelledby="dropdown">
              <li>
                <Link
                  to="/admin/posts/new"
                  className="block py-2 px-4 text-sm hover:bg-gray-600 text-gray-400 hover:text-white text-left"
                >
                  Posts
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/media"
                  className="block py-2 px-4 text-sm hover:bg-gray-600 text-gray-400 hover:text-white text-left"
                >
                  Media
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/pages/new"
                  className="block py-2 px-4 text-sm hover:bg-gray-600 text-gray-400 hover:text-white text-left"
                >
                  Pages
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/users/new"
                  className="block py-2 px-4 text-sm hover:bg-gray-600 text-gray-400 hover:text-white text-left"
                >
                  Users
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center ">
        <span className="link-special text-white flex items-center justify-center w-6 h-6 rounded-full bg-gray-500/50 mr-2">
          <FaUser />
        </span>
        <span className="avatar-name mr-h">
          Hi {user.first_name} {user.last_name}
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
    </div>
  );
};

export default Header;
