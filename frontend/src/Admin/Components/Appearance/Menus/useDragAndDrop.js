import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useDragAndDrop = (menuItems, setMenuItems, availableItems) => {
  const [activeId, setActiveId] = useState(null);

  const handleDragStart = (event) => {
    setActiveId(event.active.data.current.title);
  };

  const handleDragEnd = (event) => {
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
        parentId: overId === 'menuZone' ? 'menuZone' : overId,
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
  };

  return {
    activeId,
    handleDragStart,
    handleDragEnd
  };
};