import React from 'react';

const SidebarContent = ({
  toggleSection,
  openSections,
  formItems,
  setFormItems,
  selectedField,
  setConditionalEnabled,
  conditionalEnabled,
}) => {
  return (
    <>
      <div className="p-4 border-b border-gray-300">
        <div className="flex flex-row items-center justify-between w-full">
          <p>Advanced</p>
          <svg
            onClick={() => toggleSection('advanced')}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`size-6 text-gray-400 transition-transform duration-200 ${
              openSections.advanced ? 'rotate-180' : ''
            }`}
          >
            <path
              fillRule="evenodd"
              d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        {openSections.advanced && (
          <>
            <div className="w-full mt-4">
              <label>Default Value</label>
              <input
                type="text"
                placeholder="Default Value"
                className="mt-2 border p-2 rounded w-full"
                value={formItems.find((item) => item.id === selectedField)?.defaultValue || ''}
                onChange={(e) => {
                  const updatedItems = formItems.map((item) =>
                    item.id === selectedField ? { ...item, defaultValue: e.target.value } : item,
                  );
                  setFormItems(updatedItems);
                }}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SidebarContent;
