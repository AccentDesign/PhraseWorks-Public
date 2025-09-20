import React from 'react';

const SiteBasics = ({ websiteName, setWebsiteName, seperator, setSeperator, submitUpdate }) => {
  return (
    <div>
      <h2 className="seo-settings-header">Site Basics</h2>
      <p className="seo-settings-details">
        Set the basic info for your website. You can use tagline and separator as replacement
        variables when configuring the search appearance of your content.
      </p>
      <div className="w-full mb-4">
        <label>Website Name</label>
        <input
          type="text"
          name="websiteName"
          placeholder="WebsiteName"
          autoComplete="WebsiteName"
          value={websiteName}
          className="input"
          required
          onChange={(e) => {
            setWebsiteName(e.target.value);
          }}
        />
      </div>
      <div className="w-full mb-4">
        <label>Seperator</label>
        <input
          type="text"
          name="seperator"
          placeholder="Seperator"
          autoComplete="Seperator"
          value={seperator}
          className="input"
          required
          onChange={(e) => {
            setSeperator(e.target.value);
          }}
        />
      </div>
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
  );
};

export default SiteBasics;
