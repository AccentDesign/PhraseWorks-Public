import SortableItem from './SortableItem';
import { useDroppable } from '@dnd-kit/core';

const MenuTreeItem = ({
  item,
  level,
  isExpanded,
  toggleItemExpanded,
  removeItem,
  handleInputChange,
  renderMenuTree,
}) => {
  const { setNodeRef: setSortZoneRef, isOver: isHandleOver } = useDroppable({
    id: `${item.id}-handle`,
    data: {
      id: item.id,
      isHandle: true,
    },
  });

  const { setNodeRef: setMainDropRef, isOver: isMainOver } = useDroppable({
    id: `${item.id}`,
    data: {
      id: item.id,
      isHandle: false,
    },
  });

  return (
    <div key={item.id} style={{ marginLeft: `${level * 20}px` }}>
      <div className="p-2 border mb-2 bg-blue-50 rounded">
        <div className="w-full flex flex-row items-start">
          <div
            ref={setSortZoneRef}
            className="mr-2"
            style={{
              backgroundColor: isHandleOver ? '#e5e7eb' : undefined,
            }}
          >
            <SortableItem id={`${item.id}`} item={item}>
              {({ listeners, attributes }) => (
                <div className="cursor-move" {...listeners} {...attributes}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </SortableItem>
          </div>
          <div
            ref={setMainDropRef}
            id={item.id}
            className="w-full"
            style={{
              backgroundColor: isMainOver ? '#e5e7eb' : undefined,
            }}
          >
            <div className="w-full flex flex-row justify-between items-center">
              <p>{item.title}</p>
              <div className="flex flex-row items-center">
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-700 hover:text-red-900"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 "
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button onClick={() => toggleItemExpanded(item.id)}>
                  {isExpanded ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.28 11.47a.75.75 0 0 1-1.06 0L12 8.25l-3.22 3.22a.75.75 0 1 1-1.06-1.06l3.75-3.75a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.72 11.47a.75.75 0 0 1 1.06 0L12 14.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0l-3.75-3.75a.75.75 0 0 1 0-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {isExpanded && (
              <div className="mt-2">
                <label className="block">Label</label>
                <input
                  type="text"
                  name="title"
                  value={item.label}
                  onChange={(e) => handleInputChange(item.id, 'label', e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <label className="block mt-2">Override URL</label>
                <input
                  type="text"
                  name="href"
                  value={item.url}
                  onChange={(e) => handleInputChange(item.id, 'url', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {item.children?.length > 0 && renderMenuTree(item.children, level + 1)}
    </div>
  );
};
export default MenuTreeItem;
