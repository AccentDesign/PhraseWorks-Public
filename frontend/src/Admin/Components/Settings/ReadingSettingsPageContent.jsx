import React, { useContext, useEffect, useState } from 'react';
import TitleBar from './Reading/TitleBar';
import NumberField from './Reading/NumberField';
import { APIGetReadingSettingsData, APIUpdateReadingSettings } from '../../../API/APISystem';
import { APIConnectorContext } from '../../../Contexts/APIConnectorContext';
import { notify } from '../../../Utils/Notification';

const ReadingSettingsPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [showAtMost, setShowAtMost] = useState(0);
  const [searchEngineVisible, setSearchEngineVisible] = useState(false);

  const submitUpdate = async () => {
    const data = await APIUpdateReadingSettings(loginPassword, showAtMost, searchEngineVisible);
    if (data.status == 200) {
      if (data.data.updateReadingSettings.success) {
        fetchData();
        notify('Successfully updated reading settings.', 'success');
      } else {
        notify('Failed to update reading settings.', 'error');
      }
    } else {
      notify('Failed to update reading settings.', 'error');
    }
  };

  const fetchData = async () => {
    const data = await APIGetReadingSettingsData(loginPassword);
    if (data.status == 200) {
      console.log(data);
      setShowAtMost(data.data.getReadingSettings.show_at_most);
      setSearchEngineVisible(data.data.getReadingSettings.search_engine_visibility);
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
          <NumberField
            name={'show_at_most'}
            title={'Blog pages show at most'}
            value={showAtMost}
            updateFunction={setShowAtMost}
          />
          <div className="flex items-start">
            <input
              id="default-checkbox"
              type="checkbox"
              checked={searchEngineVisible}
              onChange={(e) => setSearchEngineVisible(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
            />
            <div className="ml-2">
              <label htmlFor="default-checkbox" className="text-sm text-gray-700">
                Discourage search engines from indexing this site
              </label>
              <p className="text-gray-500 text-sm mt-1">
                It is up to search engines to honour this request.
              </p>
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
        </div>
      </div>
    </>
  );
};

export default ReadingSettingsPageContent;
