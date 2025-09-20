import React, { useContext, useEffect, useState } from 'react';
import { APIFetchMediaItemData, APIUpdateMediaItemData } from '../../../../API/APIMedia';
import { APIConnectorContext } from '../../../../Contexts/APIConnectorContext';
import { notify } from '../../../../Utils/Notification';

const FileForm = ({ file }) => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [metaData, setMetaData] = useState({});
  const [altValue, setAltValue] = useState('');

  const isIntegerId = (id) => {
    return /^\d+$/.test(id);
  };

  const fetchData = async () => {
    if (!isIntegerId(file.id)) {
      return;
    }
    const data = await APIFetchMediaItemData(file.id);
    if (data.status == 200) {
      const values = JSON.parse(JSON.parse(data.data.getMediaItemData));
      setMetaData(values);
      if (values?.alt) {
        setAltValue(values?.alt);
      }
    }
  };

  const submitUpdate = async () => {
    if (metaData.alt != altValue) {
      metaData.alt = altValue;
    }

    const data = await APIUpdateMediaItemData(
      loginPassword,
      file.id,
      JSON.stringify(JSON.stringify(metaData)),
    );
    if (data.data.updateMediaItemData.success) {
      notify('Successfully updated.', 'success');
    } else {
      notify('Failed to update.', 'error');
    }
  };

  useEffect(() => {
    if (file.id) {
      fetchData();
    }
  }, [file]);

  return (
    <div>
      <label className="block">Alt</label>
      <input
        type="text"
        name="title"
        value={altValue}
        onChange={(e) => setAltValue(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        type="button"
        className="mt-4 flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-primary-300 focus:outline-none"
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
  );
};

export default FileForm;
