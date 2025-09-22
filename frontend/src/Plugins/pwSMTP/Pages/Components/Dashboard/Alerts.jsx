import React from 'react';

const Alerts = ({
  notifyInitial,
  setNotifyInitial,
  notifyDeliveryHardBounce,
  setNotifyDeliveryHardBounce,
  emailAlerts,
  setEmailAlerts,
  emailAlertEmail,
  setEmailAlertEmail,
}) => {
  return (
    <div className="p-4">
      <table className="w-full">
        <tbody>
          <tr className="border-b border-gray-100">
            <td colSpan={2} className="p-4">
              <h2 className="text-xl font-bold">Alerts</h2>
              <p>
                Configure at least one of these integrations to receive notifications when email
                fails to send from your site. Alert notifications will contain the following
                important data: email subject, email Send To address, the error message, and helpful
                links to help you fix the issue.
              </p>
            </td>
          </tr>
          <tr className="border-b border-gray-100">
            <td className="w-1/4 p-4 font-bold align-top">Notify when</td>
            <td className="w-3/4 p-4">
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={notifyInitial} readOnly className="sr-only peer" />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900">
                  The initial email sending request fails
                </span>
              </label>
              <span className="block italic text-gray-500 text-sm mb-4">
                This option is always enabled and will notify you about instant email sending
                failures.
              </span>
              <hr className="mb-4" />
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyDeliveryHardBounce}
                  onChange={(e) => {
                    setNotifyDeliveryHardBounce(e.target.checked);
                  }}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900">
                  The deliverability verification process detects a hard bounce
                </span>
              </label>
              <span className="block italic text-gray-500 text-sm mb-4">
                Get notified about emails that were successfully sent, but have hard bounced on
                delivery attempt. A hard bounce is an email that has failed to deliver for permanent
                reasons, such as the recipient's email address being invalid.
              </span>
            </td>
          </tr>
          <tr className="border-b border-gray-100">
            <td className="w-1/4 p-4 font-bold align-top">Email Alerts</td>
            <td className="w-3/4 p-4">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => {
                    setEmailAlerts(e.target.checked);
                  }}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900">
                  {emailAlerts ? 'ON' : 'OFF'}
                </span>
              </label>
              <span className="block italic text-gray-500 text-sm mb-4">
                Enter the email addresse you’d like to use to receive alerts when email sending
                fails
              </span>
              {emailAlerts && (
                <input
                  type="text"
                  placeholder="From Email"
                  className="border p-2 rounded w-full text-black"
                  checked={emailAlertEmail}
                  onChange={(e) => {
                    setEmailAlertEmail(e.target.value);
                  }}
                />
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Alerts;
