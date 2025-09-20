import React, { useState } from 'react';

const SettingsField = ({ value, setValue, groupedOptions }) => {
  const [open, setOpen] = useState(false);

  const selectedLabel =
    groupedOptions.flatMap((group) => group.options).find((opt) => opt.value === value)?.label ||
    'Please select...';
  return (
    <div className="relative w-full">
      <button
        type="button"
        className="w-full text-left bg-white border border-gray-300 px-4 py-2 rounded shadow flex justify-between items-center"
        onClick={() => setOpen(!open)}
      >
        <span>{selectedLabel}</span>
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 20 20"
          aria-hidden="true"
          height="200px"
          width="200px"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>

      {open && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded shadow max-h-64 overflow-y-auto">
          {groupedOptions.map((group, groupIdx) => (
            <div key={groupIdx} className="px-2 py-1">
              <div className="text-xs font-semibold text-gray-500 uppercase py-1 px-2">
                {group.label}
              </div>
              {group.options.map((option) => (
                <button
                  key={option.value}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm flex flex-row items-center"
                  onClick={() => {
                    setValue(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SettingsField;
