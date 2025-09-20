import React from 'react';
import { Link } from 'react-router-dom';

const ListView = ({
  users,
  filter,
  selectedIds,
  toggleCheckbox,
  allSelected,
  toggleAllCheckboxes,
  permanentDelete,
}) => {
  return (
    <>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAllCheckboxes}
                className="checkbox"
              />
            </th>
            <th scope="col">Username</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Role</th>
            <th scope="col">Posts</th>
            <th scope="col">Registered</th>
            <th scope="col">Edit Profile</th>
          </tr>
        </thead>
        <tbody>
          {(filter === 'all' ? users : users.filter((u) => u.user_role.role === filter)).map(
            (user, idx) => (
              <tr key={idx}>
                <td scope="row" className="table-checkbox-cell">
                  <input
                    id="default-checkbox"
                    type="checkbox"
                    value={user.id}
                    checked={selectedIds.includes(user.id)}
                    onChange={() => toggleCheckbox(user.id)}
                    className="checkbox"
                  />
                </td>
                <td className="flex flex-col">
                  <div className="flex-center">
                    <Link to={`/admin/users/edit/${user.id}`} className="link-bold">
                      {user.user_login}
                    </Link>
                  </div>
                  <div className="flex-center-4">
                    <p>
                      <button className="link-red-xs" onClick={() => permanentDelete(user.id)}>
                        Permanently Delete
                      </button>
                    </p>
                  </div>
                </td>
                <td className="">
                  {user.first_name} {user.last_name}
                </td>
                <td className="">{user.user_email}</td>
                <td className="">{user.user_role.role}</td>
                <td className="">{user.post_count}</td>
                <td className="">{new Date(user.user_registered).toLocaleDateString()}</td>
                <td className="">
                  <Link to={`/admin/users/edit/${user.id}`} className="link-bold">
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
          <div className="warning-alert" role="alert">
            <span className="font-medium">No Users Found!</span> No users match the current user
            role.
          </div>
        </>
      )}
    </>
  );
};

export default ListView;
