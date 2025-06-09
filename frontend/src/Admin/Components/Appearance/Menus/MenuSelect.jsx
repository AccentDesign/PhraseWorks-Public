import React from 'react';

const MenuSelect = ({ menus, menuId, setMenuId }) => {
  return (
    <div className="mt-4 relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
      <div className="flex flex-row items-center justify-start p-4">
        <p>Select a menu to edit </p>
        <select
          id="filter"
          className="mx-4 bg-gray-100 border-gray-300 border px-4 py-2 divide-y divide-gray-100 rounded shadow"
          value={menuId}
          onChange={(e) => setMenuId(e.target.value)}
        >
          <option value="">Please select a menu...</option>
          {menus.map((menu, idx) => (
            <option key={idx} value={menu.name}>
              {menu.name}
            </option>
          ))}
        </select>
        {menuId != '' && (
          <>
            <p>or </p>
            <button type="button" className="ml-2 text-blue-700 hover:text-blue-400">
              create a new menu
            </button>
            <p>.</p>
          </>
        )}
        <p>Do not forget to save your changes.</p>
      </div>
    </div>
  );
};

export default MenuSelect;
