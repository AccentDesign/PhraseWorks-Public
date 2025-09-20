import React from 'react';
import Droppable from './Droppable';

const MenuBuilderPanel = ({
  name,
  setName,
  menuItems,
  renderMenuTree,
  buildTree,
  submitSave
}) => {
  return (
    <div className="bg-white shadow p-4 rounded w-3/4">
      <div className="w-full">
        <label>Menu Name</label>
        <input
          type="text"
          name="name"
          placeholder="Menu Name"
          autoComplete="Name"
          value={name}
          className="input"
          required
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>
      <hr className="my-4" />
      <Droppable id={'menuZone'} className="p-4">
        {JSON.parse(menuItems).length === 0 && (
          <p className="text-gray-500 text-sm h-20 flex flex-row items-center justify-center border-4 border-dashed border-gray-300">
            Drag items here to build your menu
          </p>
        )}
        <div>{renderMenuTree(buildTree(JSON.parse(menuItems)))}</div>
      </Droppable>
      <hr className="my-4" />
      <button
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 btn"
        onClick={submitSave}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 mr-2"
        >
          <path
            fillRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
            clipRule="evenodd"
          />
        </svg>
        Save Menu
      </button>
    </div>
  );
};

export default MenuBuilderPanel;