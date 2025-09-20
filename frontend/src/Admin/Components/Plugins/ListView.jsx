import React from 'react';

const ListView = ({
  plugins,
  selectedIds,
  toggleCheckbox,
  activatePlugin,
  deactivatePlugin,
  allSelected,
  toggleAllCheckboxes,
}) => {
  return (
    <table className="plugins-table table">
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
          <th scope="col">Plugin</th>
          <th scope="col">Description</th>
        </tr>
      </thead>
      <tbody>
        {plugins.map((plugin, idx) => (
          <tr key={idx} className={`${plugin.active ? 'bg-blue-50' : 'bg-white'} `}>
            <td scope="row" className="table-checkbox-cell">
              <input
                id="default-checkbox"
                type="checkbox"
                value={idx}
                checked={selectedIds.includes(idx)}
                onChange={() => toggleCheckbox(idx)}
                className="checkbox"
              />
            </td>
            <td className="flex flex-col">
              <div className="flex flex-row items-center">{plugin.name}</div>
              <div className="flex flex-row items-center gap-4">
                {plugin.active ? (
                  <button
                    type="button"
                    className="activate-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      deactivatePlugin(idx);
                    }}
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    type="button"
                    className="activate-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      activatePlugin(idx);
                    }}
                  >
                    Activate
                  </button>
                )}
              </div>
            </td>
            <td>
              <p>{plugin.description}</p>
              <p>
                Version: {plugin.version} By{' '}
                {plugin.authorUrl != '' ? (
                  <a href={plugin.authorUrl} className="link">
                    {plugin.author}
                  </a>
                ) : (
                  <>{plugin.author}</>
                )}
              </p>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ListView;
