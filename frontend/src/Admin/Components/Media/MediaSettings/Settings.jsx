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

  const updateHeight = (idx, height) => {
    setSettings((prevSettings) => {
      const newSettings = [...prevSettings];
      newSettings[idx] = {
        ...newSettings[idx],
        height,
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
    <div className="panel mt-8">
      <div className="media-settings">
        {settings.map((setting, idx) => (
          <div key={idx} className="w-full">
            <div className="flex-row-between">
              <h2 className="m-0 text-2xl">Setting: {setting.title}</h2>
              <button
                onClick={() => deleteSetting(idx)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </div>

            <div className="mb-4 flex-row-between gap-4">
              <div className="w-1/2">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  autoComplete="Title"
                  value={setting.title}
                  className="input"
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
                  className="input-disallowed"
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
            className="text-gray-600 bg-gray-300 hover:bg-gray-400 hover:text-white btn"
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
            className="text-white bg-blue-700 hover:bg-blue-800 btn"
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
