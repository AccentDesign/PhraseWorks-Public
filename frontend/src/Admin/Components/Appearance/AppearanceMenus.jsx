import React, { useEffect, useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';

import SortableTreeLevel from './Menus/SortableTreeLevel';
import TitleBar from './Menus/TitleBar';
import MenuSelect from './Menus/MenuSelect';
import MenuTreeItem from './Menus/MenuTreeItem';
import AvailableItemsPanel from './Menus/AvailableItemsPanel';
import MenuBuilderPanel from './Menus/MenuBuilderPanel';
import { useMenuData } from './Menus/useMenuData';
import { useDragAndDrop } from './Menus/useDragAndDrop';

const AppearanceMenus = () => {
  const [menuItems, setMenuItems] = useState(JSON.stringify([]));
  const [expandedItems, setExpandedItems] = useState([]);
  const [openGroups, setOpenGroups] = useState(['Pages']);
  const [name, setName] = useState('');
  const [menuId, setMenuId] = useState('');

  // Custom hooks for data management and drag & drop
  const { availableItems, menus, fetchData, searchItems, saveMenu } = useMenuData();
  const { activeId, handleDragStart, handleDragEnd } = useDragAndDrop(menuItems, setMenuItems, availableItems);

  const toggleGroup = (type) => {
    setOpenGroups((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

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
    const currentItems = JSON.parse(menuItems);

    const updated = currentItems.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        return updatedItem;
      }
      return item;
    });

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
    await saveMenu(name, menuItems, menus);
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      await fetchData(isMounted);
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [fetchData]);

  useEffect(() => {
    if (menuId != '') {
      const selectedMenu = menus.find((menu) => menu.name == menuId);
      if (selectedMenu) {
        setMenuItems(selectedMenu.menuData);
        setName(menuId);
      }
    }
  }, [menuId, menus]);

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
            <AvailableItemsPanel
              availableItems={availableItems}
              openGroups={openGroups}
              toggleGroup={toggleGroup}
              searchItems={searchItems}
            />
            <DragOverlay>
              {activeId ? (
                <div className="p-2 border mb-2 bg-blue-50 rounded">{`${activeId}`}</div>
              ) : null}
            </DragOverlay>
            <MenuBuilderPanel
              name={name}
              setName={setName}
              menuItems={menuItems}
              renderMenuTree={renderMenuTree}
              buildTree={buildTree}
              submitSave={submitSave}
            />
          </DndContext>
        </div>
      </div>
    </>
  );
};

export default AppearanceMenus;