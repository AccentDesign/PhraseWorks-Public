import React from 'react';

const RangeField = ({ type, rangeStart, setRangeStart, rangeEnd, setRangeEnd }) => {
  return (
    <div>
      <div className="mb-4">
        <label className="block">Range Start</label>
        <input
          type="number"
          name="start"
          value={rangeStart}
          onChange={(e) => setRangeStart(parseInt(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block">Range End</label>
        <input
          type="number"
          name="end"
          value={rangeEnd}
          onChange={(e) => setRangeEnd(parseInt(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>
    </div>
  );
};

export default RangeField;
