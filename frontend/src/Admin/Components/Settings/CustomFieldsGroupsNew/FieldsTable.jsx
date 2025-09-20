import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import DraggableRow from './DraggableRow';
import { useState } from 'react';

const FieldsTable = ({ fields, setFields, expandedIndex, toggleRow, updateFieldType }) => {
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const handleDragStart = (event) => {
    setActiveId(event.active.order);
  };

  const handleDragEnd = (event) => {
    setActiveId(null);
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((f) => f.order === active.id);
      const newIndex = fields.findIndex((f) => f.order === over.id);
      setFields(arrayMove(fields, oldIndex, newIndex));
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={fields.map((f) => f.order)} strategy={verticalListSortingStrategy}>
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="w-[10%]">#</th>
              <th className="w-[30%]">Label</th>
              <th className="w-[30%]">Name</th>
              <th className="w-[30%]">Type</th>
            </tr>
          </thead>
          {fields.map((field, idx) => {
            const key = field.name && field.name !== '' ? field.name : `field-${idx}`;
            return (
              <DraggableRow
                key={key}
                id={key}
                field={field}
                fields={fields}
                setFields={setFields}
                idx={idx}
                expandedIndex={expandedIndex}
                toggleRow={toggleRow}
                updateFieldType={updateFieldType}
              />
            );
          })}
        </table>
      </SortableContext>
      <DragOverlay></DragOverlay>
    </DndContext>
  );
};

export default FieldsTable;
