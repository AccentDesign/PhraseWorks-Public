import React from 'react';

const RangeField = ({ value, setValue, label, name, defaultValue, args }) => {
  return (
    <div className="relative mb-6">
      <label htmlFor={name} className="sr-only">
        {label}
      </label>
      <input
        id={name}
        type="range"
        value={value}
        onChange={setValue}
        min={args.rangeStart}
        max={args.rangeEnd}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <span className="text-sm text-gray-500 absolute start-0 -bottom-6">
        {args.rangeStart}
      </span>
      <span className="text-sm text-gray-500 absolute end-0 -bottom-6">
        {args.rangeEnd}
      </span>
    </div>
  );
};

export default RangeField;
