import React, { useContext, useState } from 'react';
import TitleBar from './Add/TitleBar';
import { APIAddAccordion } from '../../API/APIAccordions';
import { APIConnectorContext } from '@/Contexts/APIConnectorContext';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useNavigate } from 'react-router-dom';
import { notify } from '@/Utils/Notification';

const PluginPageAddContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [items, setItems] = useState([
    { id: crypto.randomUUID(), title: 'Title', content: 'Content' },
  ]);
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  const save = async () => {
    if (title != '') {
      const data = await APIAddAccordion(loginPassword, title, items);

      if (data.status === 200 && data.data.addAccordion.post_id) {
        const postId = data.data.addAccordion.post_id;
        notify('Successfully added accordion', 'success');
        navigate(`/admin/accordions-plugin/edit/${postId}`);
      } else {
        notify('Failed to add the accordion', 'error');
      }
    } else {
      notify('Failed to add the accordion', 'error');
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return; // dropped outside the list

    const reordered = Array.from(items);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setItems(reordered);
  };

  return (
    <div className="w-full px-4 py-4">
      <TitleBar title="Accordions Plugin - Add" save={save} />
      <div className="panel mt-8">
        <div className="pb-4">
          <p className="pb-2">
            Title <span className="text-red-800">*</span>
          </p>
          <input
            type="text"
            placeholder="Title"
            className="border p-2 rounded w-full"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>

        <div className="pb-4">
          <p className="pb-2">
            Accordion Sections <span className="text-red-800">*</span>
          </p>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="accordion-list">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="w-full">
                  {items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`border-b border-gray-400 ${
                            snapshot.isDragging ? 'bg-gray-200' : ''
                          }`}
                        >
                          <div
                            onClick={() => toggle(index)}
                            className="w-full flex justify-between items-center py-4 px-6 text-left bg-gray-500 font-semibold text-white hover:bg-gray-400 transition"
                          >
                            {/* Drag handle */}
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab mr-4 p-1"
                              aria-label="Drag handle"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M4 8h16M4 16h16"
                                />
                              </svg>
                            </div>

                            <input
                              type="text"
                              placeholder="Title"
                              className="border p-2 rounded w-full text-black"
                              value={item.title}
                              onChange={(e) => {
                                const newItems = [...items];
                                newItems[index].title = e.target.value;
                                setItems(newItems);
                              }}
                            />
                            <svg
                              className={`w-5 h-5 transition-transform duration-300 mx-4 ${
                                openIndex === index ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                            <div className="flex items-center w-[100px]">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const newItem = {
                                    id: crypto.randomUUID(),
                                    title: 'Title',
                                    content: 'Content',
                                  };

                                  const newItems = [...items];
                                  newItems.splice(index + 1, 0, newItem);
                                  setItems(newItems);
                                }}
                                className="text-white bg-blue-700 hover:bg-blue-800 btn"
                              >
                                +
                              </button>
                              {index > 0 && (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    const newItems = [...items];
                                    newItems.splice(index, 1);
                                    setItems(newItems);
                                  }}
                                  className="text-white bg-blue-700 hover:bg-blue-800 btn ml-2"
                                >
                                  -
                                </button>
                              )}
                            </div>
                          </div>
                          {openIndex === index && (
                            <div className="px-6 py-4 text-gray-600 bg-gray-100 animate-fade-in">
                              <textarea
                                className="border p-2 rounded w-full text-black"
                                rows={8}
                                value={item.content}
                                onChange={(e) => {
                                  const newItems = [...items];
                                  newItems[index].content = e.target.value;
                                  setItems(newItems);
                                }}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

export default PluginPageAddContent;
