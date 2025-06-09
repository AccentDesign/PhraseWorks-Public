import React, { useContext, useEffect, useState } from 'react';
import TitleBar from './Writing/TitleBar';
import { APIGetCategories } from '../../../API/APIPosts';
import { APIGetWritingSettingsData, APIUpdateWritingSettings } from '../../../API/APISystem';
import { APIConnectorContext } from '../../../Contexts/APIConnectorContext';
import { notify } from '../../../Utils/Notification';

const WritingSettingsPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [postCatgegory, setPostCategory] = useState('');
  const [categories, setCategories] = useState([]);

  const submitUpdate = async () => {
    const data = await APIUpdateWritingSettings(loginPassword, postCatgegory);
    if (data.status == 200) {
      if (data.data.updateWritingSettings.success) {
        fetchData();
        notify('Successfully updated writing settings.', 'success');
      } else {
        notify('Failed to update writing settings.', 'error');
      }
    } else {
      notify('Failed to update writing settings.', 'error');
    }
  };

  const fetchData = async () => {
    const data = await APIGetWritingSettingsData(loginPassword);
    if (data.status == 200) {
      if (data.data.getWritingSettings.default_post_category == null) {
        setPostCategory('');
      } else {
        setPostCategory(data.data.getWritingSettings.default_post_category);
      }
    }
    const dataCategories = await APIGetCategories(loginPassword, 'category');
    if (dataCategories.status == 200) {
      setCategories(dataCategories.data.getCategories.categories);
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
          <label className="block">Default Post Category</label>
          <select
            id="defaultPostCategory"
            className="bg-gray-100 border-gray-300 border px-4 py-2 divide-y divide-gray-100 rounded shadow w-full md:w-1/2"
            value={postCatgegory}
            onChange={(e) => setPostCategory(e.target.value)}
          >
            <option value="">Uncategorised</option>
            {categories.map((category, idx) => (
              <option key={idx} value={category.term_id}>
                {category.name}
              </option>
            ))}
          </select>
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

export default WritingSettingsPageContent;
