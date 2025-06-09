import React from 'react';
import { Link } from 'react-router-dom';

const ListView = ({
  users,
  filter,
  selectedIds,
  toggleCheckbox,
  allSelected,
  toggleAllCheckboxes,
}) => {
  return (
    <>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200  ">
          <tr>
            <th scope="col" className="px-6 py-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAllCheckboxes}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
              />
            </th>
            <th scope="col" className="px-6 py-3">
              Username
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Role
            </th>
            <th scope="col" className="px-6 py-3">
              Posts
            </th>
            <th scope="col" className="px-6 py-3">
              Registered
            </th>
            <th scope="col" className="px-6 py-3">
              Edit Profile
            </th>
          </tr>
        </thead>
        <tbody>
          {(filter === 'all' ? users : users.filter((u) => u.user_role.role === filter)).map(
            (user, idx) => (
              <tr
                key={idx}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
              >
                <th
                  scope="row"
                  className="px-6 py-4 w-[40px] font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <input
                    id="default-checkbox"
                    type="checkbox"
                    value={user.id}
                    checked={selectedIds.includes(user.id)}
                    onChange={() => toggleCheckbox(user.id)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
                  />
                </th>
                <td className="px-6 py-4 flex flex-col">
                  <Link to={`/admin/users/edit/${user.id}`} className="text-blue-700 font-bold">
                    {user.user_login}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  {user.first_name} {user.last_name}
                </td>
                <td className="px-6 py-4">{user.user_email}</td>
                <td className="px-6 py-4">{user.user_role.role}</td>
                <td className="px-6 py-4">{user.post_count}</td>
                <td className="px-6 py-4">{new Date(user.user_registered).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <Link to={`/admin/users/edit/${user.id}`} className="text-blue-700 font-bold">
                    Edit Profile
                  </Link>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
      {(filter === 'all' ? users : users.filter((u) => u.user_role.role === filter)).length ==
        0 && (
        <>
          <div className="p-4 mt-4 text-sm text-yellow-800 rounded-lg bg-yellow-50" role="alert">
            <span className="font-medium">No Users Found!</span> No users match the current user
            role.
          </div>
        </>
      )}
    </>
  );
};

export default ListView;
