import React from 'react';

const ListView = ({
  themes,
  activeTheme,
  setThemeToEdit,
  setEditSliderOpen,
  valid,
  deleteTheme,
  updateActiveTheme,
}) => {
  return (
    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
      <thead className="text-xs text-gray-700 uppercase bg-gray-200  ">
        <tr>
          <th scope="col" className="px-6 py-3 w-[100px]"></th>
          <th scope="col" className="px-6 py-3 w-3/4">
            Name
          </th>
          <th scope="col" className="px-6 py-3 w-1/4">
            Location
          </th>
        </tr>
      </thead>
      <tbody>
        {themes.map((theme, idx) => (
          <tr
            key={idx}
            className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
          >
            <td className={`px-6 py-4`}>
              <button
                type="button"
                className="cursor-pointer text-gray-700 hover:text-red-500"
                onClick={() => deleteTheme(theme.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </td>
            <td className={`px-6 py-4 flex flex-col`}>
              <div className="flex flex-row items-center">
                <button
                  type="button"
                  className="text-blue-800 hover:text-blue-500"
                  onClick={() => {
                    setThemeToEdit(theme);
                    setEditSliderOpen(true);
                  }}
                >
                  {theme.name}
                  {valid == false && (
                    <span className="text-sm text-red-500">
                      {' '}
                      - Invalid, this has no folder or files in the location
                    </span>
                  )}
                </button>
                {theme.name == activeTheme.name && (
                  <div className="text-green-500 ml-4">Active</div>
                )}
              </div>
              <div className="flex flex-row items-center gap-4">
                {theme.name != activeTheme.name && (
                  <p>
                    <button
                      className={`text-blue-700 text-xs underline underline-offset-4 hover:text-blue-500 ${
                        valid == false ? 'cursor-not-allowed' : 'cursor-pointer'
                      }`}
                      disabled={valid === false}
                      onClick={() => updateActiveTheme(theme.id)}
                    >
                      Set Active
                    </button>
                  </p>
                )}
              </div>
            </td>
            <td className="px-6 py-4">{theme.location}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ListView;
