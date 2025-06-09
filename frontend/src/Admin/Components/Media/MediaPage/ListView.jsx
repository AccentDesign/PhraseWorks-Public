import React from 'react';

const ListView = ({ files, selectedIds, toggleCheckbox }) => {
  return (
    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
      <thead className="text-xs text-gray-700 uppercase bg-gray-200  ">
        <tr>
          <th scope="col" className="px-6 py-3"></th>
          <th scope="col" className="px-6 py-3">
            File
          </th>
          <th scope="col" className="px-6 py-3">
            Author
          </th>
          <th scope="col" className="px-6 py-3">
            Uploaded to
          </th>
          <th scope="col" className="px-6 py-3">
            Date
          </th>
        </tr>
      </thead>
      <tbody>
        {files.map((file, idx) => (
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
                value={file.id}
                checked={selectedIds.includes(file.id)}
                onChange={() => toggleCheckbox(file.id)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
              />
            </th>
            <td className="px-6 py-4">
              <div className="flex flex-row items-center">
                <img src={file.url} className="w-[150px]" />
                <span className="ml-4">{file.filename}</span>
              </div>
            </td>
            <td className="px-6 py-4">{file.author.user_login}</td>
            <td className="px-6 py-4">-</td>
            <td className="px-6 py-4">{new Date(file.date).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ListView;
