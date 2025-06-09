import React, { useContext, useEffect, useState } from 'react';
import TitleBar from './Email/TitleBar';
import {
  APIGetEmailSettings,
  APISendTestEmail,
  APIUpdateEmailSettings,
} from '../../../API/APISystem';
import { APIConnectorContext } from '../../../Contexts/APIConnectorContext';
import { notify } from '../../../Utils/Notification';
import Text from './Email/Text';
import NumberField from './Email/NumberField';

const EmailSettingsPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [settings, setSettings] = useState([]);

  const [sMTP_USERNAME, setSMTP_USERNAME] = useState('');
  const [sMTP_PASSWORD, setSMTP_PASSWORD] = useState('');
  const [sMTP_AUTHTYPE, setSMTP_AUTHTYPE] = useState('login');
  const [sMTP_HOST, setSMTP_HOST] = useState('');
  const [sMTP_PORT, setSMTP_PORT] = useState(587);
  const [sMTP_SECURE, setSMTP_SECURE] = useState(false);
  const [testTo, setTestTo] = useState('');

  const submitUpdate = async () => {
    const settingsData = {
      SMTP_USERNAME: sMTP_USERNAME,
      SMTP_PASSWORD: sMTP_PASSWORD,
      SMTP_AUTHTYPE: sMTP_AUTHTYPE,
      SMTP_HOST: sMTP_HOST,
      SMTP_PORT: sMTP_PORT,
      SMTP_SECURE: sMTP_SECURE,
    };
    const data = await APIUpdateEmailSettings(loginPassword, settingsData);
    if (data.status == 200) {
      if (data.data.updateEmailSettings.success) {
        fetchData();
        notify('Successfully updated email settings.', 'success');
      } else {
        notify('Failed to update email settings.', 'error');
      }
    } else {
      notify('Failed to update email settings.', 'error');
    }
  };
  const sendTest = async () => {
    if (testTo != '') {
      const data = await APISendTestEmail(loginPassword, testTo);
      if (data.status == 200) {
        setTestTo('');
        notify(
          'We cannot guarantee that it will send but have received no errors, please check your emails.',
          'success',
        );
      }
    }
  };

  const fetchData = async () => {
    const data = await APIGetEmailSettings(loginPassword);
    if (data.status == 200) {
      const settings = JSON.parse(data.data.getEmailSettings.data);
      setSettings(settings);
      setSMTP_USERNAME(settings.SMTP_USERNAME);
      setSMTP_PASSWORD(settings.SMTP_PASSWORD);
      setSMTP_AUTHTYPE(settings.SMTP_AUTHTYPE);
      setSMTP_HOST(settings.SMTP_HOST);
      setSMTP_PORT(settings.SMTP_PORT);
      setSMTP_SECURE(settings.SMTP_SECURE);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="w-full">
        <TitleBar />
        <div className="panel mt-8 mt-8">
          <Text
            name="smtp_username"
            title="SMTP Username"
            value={sMTP_USERNAME}
            updateFunction={setSMTP_USERNAME}
          />
          <Text
            name="smtp_password"
            title="SMTP Password"
            value={sMTP_PASSWORD}
            updateFunction={setSMTP_PASSWORD}
          />

          <label className="block">SMTP Authtype</label>
          <select
            id="smtp_authtype"
            className="bg-gray-100 border-gray-300 border px-4 py-2 divide-y divide-gray-100 rounded shadow w-full md:w-1/2 mb-4"
            value={sMTP_AUTHTYPE}
            onChange={(e) => setSMTP_AUTHTYPE(e.target.value)}
          >
            <option value="">Please select an option...</option>
            <option value="plain">Plain</option>
            <option value="login">Login</option>
            <option value="cram-md5">Cram md5</option>
          </select>
          <Text
            name="smtp_host"
            title="SMTP Host"
            value={sMTP_HOST}
            updateFunction={setSMTP_HOST}
          />
          <NumberField
            name="smtp_port"
            title="SMTP Port"
            value={sMTP_PORT}
            updateFunction={setSMTP_PORT}
          />
          <div className="flex items-start">
            <input
              id="default-checkbox"
              type="checkbox"
              checked={sMTP_SECURE}
              onChange={(e) => setSMTP_SECURE(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
            />
            <div className="ml-2">
              <label htmlFor="default-checkbox" className="text-sm text-gray-700">
                SMTP Secure
              </label>
            </div>
          </div>
          <div className="flex flex-row justify-end mt-8">
            <button
              type="button"
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
              onClick={submitUpdate}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 mr-2"
              >
                <path
                  fillRule="evenodd"
                  d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
                  clipRule="evenodd"
                />
              </svg>
              Update
            </button>
          </div>
          <hr className="my-4" />
          <h2 className="text-xl">Test Email</h2>
          <Text name="to" title="To Email" value={testTo} updateFunction={setTestTo} />
          <div className="flex flex-row justify-end mt-8">
            <button
              type="button"
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-gray-500 hover:bg-gray-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
              onClick={sendTest}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 mr-2"
              >
                <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
              </svg>
              Send Test
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailSettingsPageContent;
