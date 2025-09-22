import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function ChoicesEditor({ choices, setChoices }) {
  const handleAdd = () => {
    const newChoice = {
      id: `choice-${Date.now()}`,
      value: '',
    };
    setChoices([...choices, newChoice]);
  };

  const handleRemove = (id) => {
    setChoices(choices.filter((choice) => choice.id !== id));
  };

  const handleChange = (id, value) => {
    setChoices(choices.map((choice) => (choice.id === id ? { ...choice, value } : choice)));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(choices);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setChoices(reordered);
  };

  return (
    <div className="flex flex-col h-full min-h-0 pb-4">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="choices-list">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="overflow-y-auto"
              style={{ maxHeight: 'calc(100vh - 300px)' }} // adjust to your layout
            >
              {choices.map((choice, index) => (
                <Draggable key={choice.id} draggableId={choice.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`flex items-center mb-2 space-x-2 p-2 border rounded ${
                        snapshot.isDragging ? 'bg-gray-100' : ''
                      }`}
                    >
                      <div>
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          stroke-width="0"
                          viewBox="0 0 320 512"
                          height="200px"
                          width="200px"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-gray-400 cursor-grab w-4 h-4"
                        >
                          <path d="M96 32H32C14.33 32 0 46.33 0 64v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32V64c0-17.67-14.33-32-32-32zm0 160H32c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32v-64c0-17.67-14.33-32-32-32zm0 160H32c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32v-64c0-17.67-14.33-32-32-32zM288 32h-64c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32V64c0-17.67-14.33-32-32-32zm0 160h-64c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32v-64c0-17.67-14.33-32-32-32zm0 160h-64c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32v-64c0-17.67-14.33-32-32-32z"></path>
                        </svg>
                      </div>
                      <input
                        type="text"
                        value={choice.value}
                        onChange={(e) => handleChange(choice.id, e.target.value)}
                        className="flex-1 border p-1 rounded text-sm"
                        placeholder={`Choice ${index + 1}`}
                      />
                      <button
                        onClick={() => handleRemove(choice.id)}
                        className="text-red-500"
                        title="Remove"
                      >
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth="0"
                          viewBox="0 0 448 512"
                          height="200px"
                          width="200px"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                        >
                          <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path>
                        </svg>
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Button directly after scrollable list, no flex or margin pushing it down */}
      <button
        onClick={handleAdd}
        className="mt-2 flex items-center text-blue-600 hover:underline text-sm"
      >
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 448 512"
          height="200px"
          width="200px"
          xmlns="http://www.w3.org/2000/svg"
          className="mr-1 w-4 h-4"
        >
          <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path>
        </svg>{' '}
        Add Choice
      </button>
    </div>
  );
}
