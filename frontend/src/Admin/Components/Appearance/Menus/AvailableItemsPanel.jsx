import React from 'react';
import Draggable from './Draggable';

const AvailableItemsPanel = ({
  availableItems,
  openGroups,
  toggleGroup,
  searchItems
}) => {
  return (
    <div className="bg-white shadow p-4 rounded w-1/4">
      <h3 className="text-lg font-semibold mb-3">Add Menu Items</h3>
      <ul className="border rounded divide-y">
        {availableItems.map((group, idx) => (
          <li key={idx}>
            <button onClick={() => toggleGroup(group.type)} className="menu-list-header">
              <span>{group.type}</span>
              <span>{openGroups.includes(group.type) ? '▾' : '▸'}</span>
            </button>
            {openGroups.includes(group.type) && (
              <>
                <ul className="p-3 space-y-2">
                  {group.items.map((item) => (
                    <Draggable key={item.id} id={item.id} item={item}>
                      <div className="">{item.title}</div>
                    </Draggable>
                  ))}
                </ul>
                {group.type !== 'Custom Links' && (
                  <div className="px-3 mb-2 w-full">
                    <input
                      type="text"
                      name="name"
                      placeholder="Search"
                      autoComplete="Search"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5"
                      required
                      onChange={(e) => {
                        searchItems(group.type, e.target.value);
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AvailableItemsPanel;