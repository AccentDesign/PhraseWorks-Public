import React from 'react';

const UserRoleField = ({ filterByRole, setFilterByRole }) => {
  return (
    <div className="mb-4">
      <label className="block">Filter by Role</label>
      <input
        type="text"
        name="postType"
        value={filterByRole}
        onChange={(e) => setFilterByRole(e.target.value)}
        className="w-full p-2 border rounded"
      />
    </div>
  );
};

export default UserRoleField;
