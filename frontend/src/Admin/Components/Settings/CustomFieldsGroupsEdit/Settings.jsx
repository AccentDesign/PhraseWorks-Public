import React, { useState } from 'react';
import SettingsField from './SettingsField';

import { targetLists } from './targetLists';

const groupedOptionsField = [
  {
    label: 'Post',
    options: [
      { label: 'Post Type', value: 'post_type' },
      { label: 'Post Status', value: 'post_status' },
    ],
  },
  //   {
  //     label: 'Page',
  //     options: [{ label: 'Page Parent', value: 'page_parent' }],
  //   },
  {
    label: 'User',
    options: [
      { label: 'Current User', value: 'current_user' },
      { label: 'Current User Role', value: 'current_user_role' },
    ],
  },
];

const groupedOptionsEquals = [
  {
    label: 'Equal',
    options: [
      { label: 'is equal to', value: 'is_equal' },
      { label: 'is not equal to', value: 'is_not_equal' },
    ],
  },
];

const Settings = ({ rules, setRules, active, setActive }) => {
  const [activeContentTab, setActiveContentTab] = useState('location');
  const addNewRule = () => {
    setRules((prevRules) => [
      ...prevRules,
      { field: 'post_type', equal: 'is_equal', target: 'post' },
    ]);
  };

  const removeRule = (idx) => {
    setRules((prevRules) => prevRules.filter((_, i) => i !== idx));
  };

  const updateRuleValue = (index, key, value) => {
    setRules((prevRules) =>
      prevRules.map((rule, idx) => (idx === index ? { ...rule, [key]: value } : rule)),
    );
  };

  return (
    <div className="relative shadow-md sm:rounded-lg bg-white w-full mt-4 p-4">
      <div className="flex flex-row items-center">
        <h2 className="text-3xl">Settings</h2>
      </div>
      <div className="flex flex-row justify-between items-center">
        <div className="flex justify-end border-b border-gray-200">
          <button
            className={`px-4 py-2 ${
              activeContentTab === 'location'
                ? 'border-b-4 border-blue-500 text-blue-500'
                : 'text-gray-800 font-medium'
            }`}
            onClick={() => setActiveContentTab('location')}
          >
            Location
          </button>
          <button
            className={`px-4 py-2 ${
              activeContentTab === 'settings'
                ? 'border-b-4 border-blue-500 text-blue-500'
                : 'text-gray-800 font-medium'
            }`}
            onClick={() => setActiveContentTab('settings')}
          >
            Group Settings
          </button>
        </div>
      </div>
      <div className="mt-4">
        {activeContentTab === 'location' && (
          <>
            <p className="font-bold">Rules</p>
            <p className="font-bold">Show this field group if</p>
            {rules.map((rule, idx) => (
              <div key={idx} className="flex flex-row items-center gap-4 mb-4">
                <div className="w-2/5 flex flex-row items-center gap-4">
                  {idx > 0 && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 text-red-700 hover:text-red-500 cursor-pointer"
                      onClick={() => removeRule(idx)}
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <SettingsField
                    value={rule.field}
                    setValue={(val) => updateRuleValue(idx, 'field', val)}
                    groupedOptions={groupedOptionsField}
                  />
                </div>
                <div className="w-1/5">
                  <SettingsField
                    value={rule.equal}
                    setValue={(val) => updateRuleValue(idx, 'equal', val)}
                    groupedOptions={groupedOptionsEquals}
                  />
                </div>
                <div className="w-2/5">
                  <SettingsField
                    value={rule.target}
                    setValue={(val) => updateRuleValue(idx, 'target', val)}
                    groupedOptions={
                      targetLists.find((targetItem) => targetItem.name == rule.field).list
                    }
                  />
                </div>
              </div>
            ))}
            <button
              onClick={() => addNewRule()}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              Add rule group
            </button>
          </>
        )}
        {activeContentTab === 'settings' && (
          <>
            <div className="mb-4">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                />
                <div
                  className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer 
        peer-checked:after:translate-x-full 
        peer-checked:after:border-white 
        after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border 
        after:rounded-full after:h-5 after:w-5 after:transition-all 
        peer-checked:bg-blue-600"
                ></div>
                <div className="flex flex-col">
                  <span className="ms-3 text-sm font-medium text-gray-900 block">
                    Active
                  </span>
                </div>
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Settings;
