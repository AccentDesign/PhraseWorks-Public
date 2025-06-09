import React, { useContext, useEffect, useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { v4 as uuidv4 } from 'uuid';

import SortableTreeLevel from './Menus/SortableTreeLevel';
import Draggable from './Menus/Draggable';
import Droppable from './Menus/Droppable';
import TitleBar from './Menus/TitleBar';
import { APIGetPosts } from '../../../API/APIPosts';
import { APIConnectorContext } from '../../../Contexts/APIConnectorContext';
import MenuSelect from './Menus/MenuSelect';
import { APIGetMenus, APIUpdateMenus } from '../../../API/APISystem';
import MenuTreeItem from './Menus/MenuTreeItem';
import { notify } from '../../../Utils/Notification';

const AppearanceMenus = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [menuItems, setMenuItems] = useState(JSON.stringify([]));
  const [expandedItems, setExpandedItems] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [openGroups, setOpenGroups] = useState(['Pages']);
  const [availableItems, setAvailableItems] = useState([]);
  const [name, setName] = useState('');
  const [menus, setMenus] = useState([]);
  const [menuId, setMenuId] = useState('');

  const toggleGroup = (type) => {
    setOpenGroups((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  function handleDragStart(event) {
    setActiveId(event.active.data.current.title);
  }

  function handleDragEnd(event) {
    setActiveId(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const isHandleDrop = over.id.endsWith('-handle');
    const overId = isHandleDrop ? over.data?.current.id : over.id;
    const tmpMenuItems = JSON.parse(menuItems);

    const isFromAvailableItems = availableItems
      .flatMap((group) => group.items)
      .some((i) => i.id === activeId);

    if (isFromAvailableItems) {
      const item = availableItems.flatMap((group) => group.items).find((i) => i.id === activeId);
      if (!item) return;

      const newItem = {
        ...item,
        id: uuidv4(),
        parentId: overId === 'menuZone' ? 'menuZone' : overId, // ← this line is the fix
        label: item.title,
        url: item.url,
        type: item.type,
        postId: item?.postId,
      };

      tmpMenuItems.push(newItem);
      setMenuItems(JSON.stringify(tmpMenuItems));
      return;
    }

    const draggedItemIndex = tmpMenuItems.findIndex((i) => i.id === activeId);
    const draggedItem = tmpMenuItems[draggedItemIndex];
    const overItem =
      overId === 'menuZone'
        ? { id: 'menuZone', parentId: null }
        : tmpMenuItems.find((i) => i.id === overId);

    if (!draggedItem || !overItem) return;
    if (isHandleDrop) {
      const parentId = draggedItem.parentId;
      const siblings = tmpMenuItems.filter((i) => i.parentId === parentId);

      const fromIndex = siblings.findIndex((i) => i.id === draggedItem.id);
      const toIndex = siblings.findIndex((i) => i.id === overItem.id);

      if (fromIndex === -1 || toIndex === -1) return;

      siblings.splice(toIndex, 0, siblings.splice(fromIndex, 1)[0]);

      const others = tmpMenuItems.filter((i) => i.parentId !== parentId);
      setMenuItems(JSON.stringify([...others, ...siblings]));
      return;
    }

    tmpMenuItems[draggedItemIndex].parentId = overItem.id === 'menuZone' ? 'menuZone' : overItem.id;
    setMenuItems(JSON.stringify(tmpMenuItems));
  }

  const toggleItemExpanded = (id) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const buildTree = (items, parentId = 'menuZone') => {
    return items
      .filter((item) => item.parentId === parentId)
      .map((item) => ({
        ...item,
        children: buildTree(items, item.id),
      }));
  };

  const handleInputChange = (id, field, value) => {
    const updated = JSON.parse(menuItems).map((item) =>
      item.id === id ? { ...item, [field]: value } : item,
    );
    setMenuItems(JSON.stringify(updated));
  };

  const removeItem = (itemId) => {
    const allItems = JSON.parse(menuItems);

    const collectDescendantIds = (id, items) => {
      const directChildren = items.filter((item) => item.parentId === id);
      const childIds = directChildren.map((child) => child.id);
      return childIds.reduce(
        (acc, childId) => acc.concat(childId, collectDescendantIds(childId, items)),
        childIds,
      );
    };

    const idsToRemove = [itemId, ...collectDescendantIds(itemId, allItems)];

    const updatedItems = allItems.filter((item) => !idsToRemove.includes(item.id));

    setMenuItems(JSON.stringify(updatedItems));
  };

  const submitSave = async () => {
    const newMenu = { name, menuData: menuItems };

    // If you have an array of existing menus:
    const updatedMenus = [...menus];
    const existingIndex = updatedMenus.findIndex((m) => m.name === name);
    if (existingIndex !== -1) {
      // Replace existing menu
      updatedMenus[existingIndex] = newMenu;
    } else {
      // Add new menu
      updatedMenus.push(newMenu);
    }
    const data = await APIUpdateMenus(loginPassword, updatedMenus);
    if (data.status == 200) {
      if (data.data.updateMenus.success) {
        notify('Successfully updated menus.', 'success');
      } else {
        notify('Failed to update menus.', 'error');
      }
    } else {
      notify('Failed to update menus.', 'error');
    }
  };

  const fetchData = async () => {
    let pages = [];
    let posts = [];

    const pagesData = await APIGetPosts(loginPassword, 0, 9999999, 'page');
    if (pagesData.status == 200) {
      pages = pagesData.data.getPosts.posts;
    }
    const postsData = await APIGetPosts(loginPassword, 0, 9999999, 'post');
    if (postsData.status == 200) {
      posts = postsData.data.getPosts.posts;
    }

    const tmpItems = [
      {
        type: 'Pages',
        items: pages.map((page) => ({
          id: `page-${page.id}`,
          title: page.post_title,
          url: `/${page.post_name}`,
          type: 'page',
          postId: page.id,
        })),
      },
      {
        type: 'Posts',
        items: posts.map((post) => ({
          id: `post-${post.id}`,
          title: post.post_title,
          url: `/${post.post_name}`,
          type: 'post',
          postId: post.id,
        })),
      },
      {
        type: 'Custom Links',
        items: [{ id: 'custom', title: 'Custom', url: '/', type: 'custom' }],
      },
    ];
    setAvailableItems(tmpItems);

    const menusData = await APIGetMenus(loginPassword);
    if (menusData.status == 200) {
      setMenus(JSON.parse(menusData.data.getMenus));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (menuId != '') {
      setMenuItems(menus.find((menu) => menu.name == menuId).menuData);
      setName(menuId);
    }
  }, [menuId]);

  const renderMenuTree = (tree, level = 0) => {
    return (
      <SortableTreeLevel items={tree}>
        {tree.map((item) => {
          const isExpanded = expandedItems.includes(item.id);
          return (
            <MenuTreeItem
              key={item.id}
              item={item}
              level={level}
              isExpanded={isExpanded}
              toggleItemExpanded={toggleItemExpanded}
              removeItem={removeItem}
              handleInputChange={handleInputChange}
              renderMenuTree={renderMenuTree}
            />
          );
        })}
      </SortableTreeLevel>
    );
  };

  return (
    <>
      <div className="w-full">
        <TitleBar />
        <MenuSelect menus={menus} menuId={menuId} setMenuId={setMenuId} />
        <div className="w-full flex flex-row items-start mt-8 gap-4">
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="bg-white shadow p-4 rounded w-1/4">
              <h3 className="text-lg font-semibold mb-3">Add Menu Items</h3>
              <ul className="border rounded divide-y">
                {availableItems.map((group, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => toggleGroup(group.type)}
                      className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 font-semibold flex justify-between items-center"
                    >
                      <span>{group.type}</span>
                      <span>{openGroups.includes(group.type) ? '▾' : '▸'}</span>
                    </button>
                    {openGroups.includes(group.type) && (
                      <ul className="p-3 space-y-2">
                        {group.items.map((item) => (
                          <Draggable key={item.id} id={item.id} item={item}>
                            <div className="">{item.title}</div>
                          </Draggable>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <DragOverlay>
              {activeId ? (
                <div className="p-2 border mb-2 bg-blue-50 rounded">{`${activeId}`}</div>
              ) : null}
            </DragOverlay>
            <div className="bg-white shadow p-4 rounded w-3/4">
              <div className="w-full">
                <label>Menu Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Menu Name"
                  autoComplete="Name"
                  value={name}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
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
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
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
          </DndContext>
        </div>
      </div>
    </>
  );
};

export default AppearanceMenus;
