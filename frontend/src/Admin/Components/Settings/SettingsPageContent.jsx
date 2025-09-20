import React, { useContext, useEffect, useState } from 'react';
import TitleBar from '../Settings/Dashboard/TitleBar';
import Text from '../Settings/Dashboard/Text';
import { APIConnectorContext } from '../../../Contexts/APIConnectorContext';
import { APIGetGeneralSettingsData, APIUpdateGeneralSettingsData } from '../../../API/APISystem';
import { notify } from '../../../Utils/Notification';

const SettingsPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [siteTitle, setSiteTitle] = useState('');
  const [siteTagline, setSiteTagline] = useState('');
  const [siteAddress, setSiteAddress] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  const submitUpdate = async () => {
    const data = await APIUpdateGeneralSettingsData(
      loginPassword,
      siteTitle,
      siteAddress,
      adminEmail,
      siteTagline,
    );
    if (data.status == 200) {
      if (data.data.updateGeneralSettings.success) {
        fetchData();
        notify('Successfully updated settings.', 'success');
      } else {
        notify('Failed to update settings.', 'error');
      }
    } else {
      notify('Failed to update settings.', 'error');
    }
  };

  const fetchData = async () => {
    const data = await APIGetGeneralSettingsData(loginPassword);
    if (data.status == 200) {
      const options = data.data.getGeneralSettings;
      setSiteTitle(options.site_title);
      setSiteTagline(options.site_tagline ?? '');
      setSiteAddress(options.site_address);
      setAdminEmail(options.admin_email);
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
            title="Site Title"
            name="site_title"
            value={siteTitle}
            updateFunction={setSiteTitle}
          />
          <Text
            title="Site Tagline"
            name="site_tagline"
            value={siteTagline}
            updateFunction={setSiteTagline}
          />
          <Text
            title="Site Address"
            name="site_address"
            value={siteAddress}
            updateFunction={setSiteAddress}
          />
          <Text
            title="Administration Email Address"
            name="admin_email"
            value={adminEmail}
            updateFunction={setAdminEmail}
            text="This address is used for admin purposes. If you change this, an email will be sent to your new address to confirm it. The new address will not become active until confirmed."
          />
          <div className="flex flex-row justify-end">
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 btn"
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
        </div>
      </div>
    </>
  );
};

export default SettingsPageContent;
