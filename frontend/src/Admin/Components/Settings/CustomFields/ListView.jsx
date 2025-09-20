import React from 'react';
import { Link } from 'react-router-dom';

const ListView = ({
  groups,
  selectedIds,
  toggleCheckbox,
  restoreGroup,
  binGroup,
  allSelected,
  toggleAllCheckboxes,
}) => {
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th scope="col">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAllCheckboxes}
              className="chexkbox mt-1"
            />
          </th>
          <th scope="col">Title</th>
          <th scope="col">Description</th>
          <th scope="col">Key</th>
          <th scope="col">Location</th>
          <th scope="col">Fields</th>
        </tr>
      </thead>
      <tbody>
        {groups.map((group, idx) => (
          <tr key={idx}>
            <td scope="row" className="table-checkbox-cell">
              <input
                id="default-checkbox"
                type="checkbox"
                value={group.id}
                checked={selectedIds.includes(group.id)}
                onChange={() => toggleCheckbox(group.id)}
                className="checkbox"
              />
            </td>
            <td className="flex flex-col">
              <div className="flex-center">
                <Link to={`/admin/settings/custom_fields/group/${group.id}`} className="link-bold">
                  {group.name}
                </Link>
              </div>
              <div className="flex-center-4">
                {group.status == 'trash' ? (
                  <>
                    <p>
                      <button className="link-blue-xs" onClick={() => restoreGroup(group.id)}>
                        Restore
                      </button>
                    </p>
                    <p>
                      <button className="link-red-xs">Permanently Delete</button>
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <button
                        className="link-red-xs"
                        onClick={() => {
                          binGroup(group.id);
                        }}
                      >
                        Bin
                      </button>
                    </p>
                  </>
                )}
              </div>
            </td>
            <td>{group.description ? group.description : '-'}</td>
            <td>{`group_${group.id}`}</td>
            <td>
              {group.rules[0].target
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </td>
            <td>{group.fields.length}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ListView;
