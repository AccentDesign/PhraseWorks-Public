import React from 'react';

const NameAndLabelField = ({ label, setLabel, name, setName }) => {
  return (
    <>
      <div className="mb-4">
        <label className="block">Field Label</label>
        <input
          type="text"
          name="label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="input-white"
        />
      </div>
      <div className="mb-4">
        <label className="block">Field Name</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, ''),
            )
          }
          className="input-white"
        />
      </div>
    </>
  );
};

export default NameAndLabelField;
