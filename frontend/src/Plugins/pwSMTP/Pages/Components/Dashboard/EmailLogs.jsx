import React from 'react';

const EmailLogs = ({
  enabledEmailLog,
  setEnabledEmailLog,
  logEmailContent,
  setLogEmailContent,
  saveAttachments,
  setSaveAttachments,
  openEmailTracking,
  setOpenEmailTracking,
  clickLinkTracking,
  setClickLinkTracking,
  logRetention,
  setLogRetention,
}) => {
  return (
    <div className="p-4">
      <table className="w-full">
        <tbody>
          <tr className="border-b border-gray-100">
            <td className="w-1/4 p-4 font-bold align-top">Enable Log</td>
            <td className="w-3/4 p-4">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabledEmailLog}
                  onChange={(e) => {
                    setEnabledEmailLog(e.target.checked);
                  }}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900">
                  {enabledEmailLog ? 'ON' : 'OFF'}
                </span>
              </label>
              <span className="block italic text-gray-500 text-sm mb-4">
                Keep a record of basic details for all emails sent from your site.
              </span>
              <p>
                This will allow you to view both general information (date sent, subject, email
                status) and technical information (all the headers, including TO, CC, BCC) for all
                sent emails.
              </p>
            </td>
          </tr>
          <tr className="border-b border-gray-100">
            <td className="w-1/4 p-4 font-bold align-top">Log Email Content</td>
            <td className="w-3/4 p-4">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={logEmailContent}
                  onChange={(e) => {
                    setLogEmailContent(e.target.checked);
                  }}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900">
                  {logEmailContent ? 'ON' : 'OFF'}
                </span>
              </label>
              <span className="block italic text-gray-500 text-sm mb-4">
                Keep a record of all content for all emails sent from your site.
              </span>
              <p>
                Email content may contain personal information, such as plain text passwords. Please
                carefully consider before enabling this option, as it will store all sent email
                content to your site’s database.
              </p>
              <p>
                This option has to be enabled if you want to{' '}
                <span className="font-bold">resend emails</span> from our Email Log.
              </p>
            </td>
          </tr>
          <tr className="border-b border-gray-100">
            <td className="w-1/4 p-4 font-bold align-top">Save Attachments</td>
            <td className="w-3/4 p-4">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveAttachments}
                  onChange={(e) => {
                    setSaveAttachments(e.target.checked);
                  }}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900">
                  {saveAttachments ? 'ON' : 'OFF'}
                </span>
              </label>
              <span className="block italic text-gray-500 text-sm mb-4">
                Save the sent attachments to the Email Log.
              </span>
              <p>
                All sent attachments will be saved to your WordPress uploads folder. If your site
                sends a lot of big unique attachments, this could potentially cause some disk space
                issue.
              </p>
            </td>
          </tr>
          <tr className="border-b border-gray-100">
            <td className="w-1/4 p-4 font-bold align-top">Open Email Tracking</td>
            <td className="w-3/4 p-4">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={openEmailTracking}
                  onChange={(e) => {
                    setOpenEmailTracking(e.target.checked);
                  }}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900">
                  {openEmailTracking ? 'ON' : 'OFF'}
                </span>
              </label>
              <span className="block italic text-gray-500 text-sm mb-4">
                Track when an email is opened.
              </span>
              <p>This will allow you to see which emails were opened by the recipients.</p>
            </td>
          </tr>
          <tr className="border-b border-gray-100">
            <td className="w-1/4 p-4 font-bold align-top">Click Link Tracking</td>
            <td className="w-3/4 p-4">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={clickLinkTracking}
                  onChange={(e) => {
                    setClickLinkTracking(e.target.checked);
                  }}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900">
                  {clickLinkTracking ? 'ON' : 'OFF'}
                </span>
              </label>
              <span className="block italic text-gray-500 text-sm mb-4">
                Track clicked links in emails.
              </span>
              <p>This will allow you to see which links were clicked in the sent emails.</p>
            </td>
          </tr>
          <tr className="border-b border-gray-100">
            <td className="w-1/4 p-4 font-bold align-top">Click Link Tracking</td>
            <td className="w-3/4 p-4">
              <select
                className="border p-2 rounded text-black"
                value={logRetention}
                onChange={(e) => setLogRetention(e.target.value)}
              >
                <option value="Forever">Forever</option>
                <option value="1 Day">1 Day</option>
                <option value="1 Week">1 Week</option>
                <option value="1 Month">1 Month</option>
                <option value="6 Months">6 Months</option>
                <option value="1 Year">1 Year</option>
              </select>

              <span className="block italic text-gray-500 text-sm mt-2 mb-4">
                Email logs older than the selected period will be permanently deleted from the
                database.
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EmailLogs;
