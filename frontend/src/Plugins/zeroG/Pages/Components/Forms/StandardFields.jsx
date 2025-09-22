import React from 'react';

import { Draggable } from '@hello-pangea/dnd';

const StandardFields = ({ PALETTE_ITEMS }) => {
  const standardSection = PALETTE_ITEMS.find((item) => item.id === 'standard');
  return (
    <>
      <div>
        <div className="flex flex-row items-center justify-between p-4">
          <p>Standard Fields</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6 text-gray-400"
          >
            <path
              fillRule="evenodd"
              d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          {standardSection?.items.map((field, index) => (
            <Draggable key={field.id} draggableId={field.id} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={`border border-gray-500 p-4 flex flex-col gap-2 justify-center items-center cursor-pointer ${
                    snapshot.isDragging ? 'bg-blue-100' : ''
                  }`}
                >
                  {field.icon}
                  <p className="text-center">{field.label}</p>
                </div>
              )}
            </Draggable>
          ))}
        </div>
      </div>
    </>
  );
};

export default StandardFields;
