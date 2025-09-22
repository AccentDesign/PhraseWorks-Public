import React from 'react';

const Misc = ({ stopSending, setStopSending }) => {
  return (
    <div className="p-4">
      <table className="w-full">
        <tbody>
          <tr>
            <td className="w-1/4 p-4 font-bold align-top">Do Not Send</td>
            <td className="w-3/4 p-4">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={stopSending}
                  onChange={(e) => {
                    setStopSending(e.target.checked);
                  }}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900">
                  {stopSending ? 'ON' : 'OFF'}
                </span>
              </label>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Misc;
