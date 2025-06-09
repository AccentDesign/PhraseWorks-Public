import React from 'react';

const MenuItem = ({ item }) => {
  return (
    <li className="relative group">
      <a href={item.url} className="block px-4 py-2 hover:bg-gray-100">
        {item.label || item.title}
      </a>
      {item.children?.length > 0 && (
        <ul
          className={`absolute left-${
            item.parentId == 'menuZone' ? 0 : 5
          } top-full bg-white border hidden group-hover:block`}
        >
          {item.children.map((child) => (
            <MenuItem key={child.id} item={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

const HeaderMenu = ({ menu }) => {
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
    <nav className="bg-white border-b">
      <ul className="flex space-x-4 p-4">
        {tree.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </ul>
    </nav>
  );
};

export default HeaderMenu;
