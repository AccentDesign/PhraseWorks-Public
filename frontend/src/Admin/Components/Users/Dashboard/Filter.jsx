import React, { useEffect, useState } from 'react';
import { APIGetUserRoles } from '../../../../API/APIUsers';

const Filter = ({ setFilter, totalUsers, filter, users, loginPassword }) => {
  const [roles, setRoles] = useState([]);
  const fetchData = async () => {
    const data = await APIGetUserRoles(loginPassword);
    if (data.status == 200) {
      setRoles(data.data.getUserRoles.roles);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-row gap-4 mt-4">
      <button
        type="button"
        onClick={() => setFilter('all')}
        className={`text-sm ${filter == 'all' ? 'text-black font-bold' : 'text-blue-800'}`}
      >
        All <span className="font-normal">({totalUsers})</span>
      </button>
      {roles?.map((role) => (
        <button
          key={role.id}
          type="button"
          onClick={() => setFilter(role.role)}
          className={`text-sm ${filter == role.role ? 'text-black font-bold' : 'text-blue-800'}`}
        >
          {role.role.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}{' '}
          <span className="font-normal">
            ({users.filter((user) => user.user_role.id == role.id).length})
          </span>
        </button>
      ))}
    </div>
  );
};

export default Filter;
