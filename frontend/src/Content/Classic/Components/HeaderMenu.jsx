import React from 'react';
import { useLocation } from 'react-router-dom';

const DownArrow = () => (
  <svg
    className="inline-block ml-1 w-3 h-3"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const MenuItem = ({ item, mobile }) => {
  const location = useLocation();
  const isActive = location.pathname === item.url;

  return (
    <li className="relative group">
      <a
        href={item.url}
        className={`header-link flex items-center ${isActive ? 'active-link' : ''}`}
      >
        {item.label || item.title}
        {item.children?.length > 0 && <DownArrow />}
      </a>

      {item.children?.length > 0 && (
        <ul
          className={`
            ${
              mobile
                ? `pl-4`
                : `absolute
                left-0
                top-full
                bg-green-900
                shadow-lg
                opacity-0
                invisible
                group-hover:opacity-100
                group-hover:visible
                transition-opacity
                duration-150
                z-10`
            }
            
            min-w-[160px]`}
          style={{ marginTop: 0 /* IMPORTANT: remove margin */ }}
        >
          {item.children.map((child) => (
            <MenuItem key={child.id} item={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

const HeaderMenu = ({ menu, mobile }) => {
  const buildTree = (data) => {
    const itemsById = {};
    const rootItems = [];

    data.forEach((item) => {
      itemsById[item.id] = { ...item, children: [] };
    });

    data.forEach((item) => {
      if (item.parentId === 'menuZone') {
        rootItems.push(itemsById[item.id]);
      } else if (itemsById[item.parentId]) {
        itemsById[item.parentId].children.push(itemsById[item.id]);
      }
    });

    return rootItems;
  };

  let tree = [];
  if (menu?.data) tree = buildTree(menu.data);

  return (
    <>
      {tree.map((item) => (
        <MenuItem key={item.id} item={item} mobile={mobile} />
      ))}
    </>
  );
};

export default HeaderMenu;
