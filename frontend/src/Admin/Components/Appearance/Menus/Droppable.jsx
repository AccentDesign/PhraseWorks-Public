import React from 'react';
import { useDroppable } from '@dnd-kit/core';

const Droppable = (props) => {
  const { setNodeRef, isOver } = useDroppable({
    id: props.id,
    data: { isHandle: false },
  });
  const style = {
    backgroundColor: isOver ? '#e5e7eb' : undefined,
    marginLeft: props.marginLeft != 0 ? `${props.marginLeft}px` : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className={props.className}>
      {props.children}
    </div>
  );
};
export default Droppable;
