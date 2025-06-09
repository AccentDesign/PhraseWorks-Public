import React from 'react';
import { useDraggable } from '@dnd-kit/core';

const Draggable = (props) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: props.id,
    data: props.item,
  });

  return (
    <li
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="p-2 border mb-2 bg-blue-50 rounded"
    >
      {props.children}
    </li>
  );
};
export default Draggable;
