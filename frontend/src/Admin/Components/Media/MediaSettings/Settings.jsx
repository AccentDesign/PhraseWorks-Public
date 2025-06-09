import React, { useContext, useEffect, useState } from 'react';
import { APIConnectorContext } from '../../../../Contexts/APIConnectorContext';
import { APIGetMediaSettings, APIUpdateMediaSettings } from '../../../../API/APIMedia';

import { notify } from '../../../../Utils/Notification';

const Settings = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [settings, setSettings] = useState([]);

  const AddEntry = () => {
    setSettings((prevSettings) => [
      ...prevSettings,
      { title: '', slug: '', width: '', height: '' },
    ]);
  };

  const updateTitle = (idx, title) => {
    const slug = title
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with dashes
      .replace(/[^a-z0-9\-]/g, ''); // Remove non-alphanumeric and non-dash chars

    setSettings((prevSettings) => {
      const newSettings = [...prevSettings];
      newSettings[idx] = {
        ...newSettings[idx],
        title,
        slug,
      };
      return newSettings;
    });
  };

  const updateWidth = (idx, width) => {
    setSettings((prevSettings) => {
      const newSettings = [...prevSettings];
      newSettings[idx] = {
        ...newSettings[idx],
        width,
      };
      return newSettings;
    });
  };

  const updateHeight = (idx, width) => {
    setSettings((prevSettings) => {
      const newSettings = [...prevSettings];
      newSettings[idx] = {
        ...newSettings[idx],
        width,
      };
      return newSettings;
    });
  };

  const deleteSetting = (idx) => {
    setSettings((prevSettings) => prevSettings.filter((_, i) => i !== idx));
  };

  const updateSettings = async () => {
    const data = await APIUpdateMediaSettings(loginPassword, JSON.stringify(settings));
    if (data.status == 200) {
      if (data.data.updateMediaSettings.success) {
        notify('Successfully updated settings', 'success');
      } else {
        notify('Failed to update settings', 'error');
      }
    }
  };

  const fetchData = async () => {
    const data = await APIGetMediaSettings(loginPassword);
    if (data.status == 200) {
      setSettings(JSON.parse(data.data.getMediaSettings.settings));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="relative bg-white shadow-md dark:bg-gray-800 sm:rounded-lg mt-4">
      <div className="flex flex-col items-start justify-start p-4 space-y-3 md:flex-col md:space-y-4">
        {settings.map((setting, idx) => (
          <div key={idx} className="w-full">
            <div className="flex flex-row justify-between">
              <h2 className="m-0 text-2xl">Setting: {setting.title}</h2>
              <button
                onClick={() => deleteSetting(idx)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </div>

            <div className="mb-4 flex flex-row justify-between gap-4">
              <div className="w-1/2">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  autoComplete="Title"
                  value={setting.title}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                  required
                  onChange={(e) => {
                    updateTitle(idx, e.target.value);
                  }}
                />
              </div>
              <div className="w-1/2">
                <label>Slug</label>
                <input
                  type="text"
                  name="slug"
                  placeholder="Slug"
                  autoComplete="Slug"
                  disabled
                  value={setting.slug}
                  className="cursor-not-allowed bg-gray-100 border border-gray-300 text-gray-400 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                />
              </div>
            </div>

            <div className="my-4 flex flex-row justify-between gap-4">
              <div className="w-1/2">
                <label>Width</label>
                <input
                  type="text"
                  name="width"
                  placeholder="Width"
                  autoComplete="Width"
                  value={setting.width}
                  className="bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                  onChange={(e) => {
                    updateWidth(idx, e.target.value);
                  }}
                />
              </div>
              <div className="w-1/2">
                <label>Height</label>
                <input
                  type="text"
                  name="height"
                  placeholder="Height"
                  autoComplete="Height"
                  value={setting.height}
                  className="bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                  onChange={(e) => {
                    updateHeight(idx, e.target.value);
                  }}
                />
              </div>
            </div>
            <hr />
          </div>
        ))}
        <div className="flex flex-row items-center gap-4">
          <button
            type="button"
            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-800 rounded-lg bg-gray-300 hover:bg-gray-400 hover:text-white focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
            onClick={() => {
              AddEntry();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 mr-2 -ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                clipRule="evenodd"
              />
            </svg>
            Add A New Setting
          </button>
          <button
            type="button"
            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
            onClick={() => {
              updateSettings(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 mr-2 -ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                clipRule="evenodd"
              />
            </svg>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
