import React from 'react';

const Eye = () => {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 576 512"
      height="200px"
      width="200px"
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
    >
      <path d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"></path>
    </svg>
  );
};

const Chevrons = ({ expanded, itemName }) => {
  return (
    <>
      {expanded.find((item) => item.name == itemName).expanded ? (
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 20 20"
          aria-hidden="true"
          height="200px"
          width="200px"
          xmlns="http://www.w3.org/2000/svg"
          className="seo-settings-sidebar-chevron w-4 h-4"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      ) : (
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 20 20"
          aria-hidden="true"
          height="200px"
          width="200px"
          xmlns="http://www.w3.org/2000/svg"
          className="seo-settings-sidebar-chevron w-4 h-4"
        >
          <path
            fillRule="evenodd"
            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      )}
    </>
  );
};

const Sidebar = ({ expanded, updateExpanded, activeTab, setActiveTab }) => {
  return (
    <div className="seo-settings-sidebar">
      <div className="w-full">
        <div
          className="seo-settings-sidebar-block-header"
          onClick={() =>
            updateExpanded(
              'general',
              expanded.find((item) => item.name == 'general').expanded ? false : true,
            )
          }
        >
          <div>General</div>

          <Chevrons expanded={expanded} itemName="general" />
        </div>
        <ul
          className={`seo-settings-sidebar-list ${
            expanded.find((item) => item.name === 'general').expanded ? 'max-h-96' : 'max-h-0'
          }`}
        >
          <li
            className=" seo-settings-sidebar-list-item"
            onClick={() => setActiveTab('site_basics')}
          >
            {activeTab == 'site_basics' && <Eye />}
            <p>Site Basics</p>
          </li>
        </ul>
      </div>
      <div className="w-full">
        <div
          className="seo-settings-sidebar-block-header-mid"
          onClick={() =>
            updateExpanded(
              'content',
              expanded.find((item) => item.name == 'content').expanded ? false : true,
            )
          }
        >
          <div>Content Types</div>

          <Chevrons expanded={expanded} itemName="content" />
        </div>
        <ul
          className={`seo-settings-sidebar-list ${
            expanded.find((item) => item.name === 'content').expanded ? 'max-h-96' : 'max-h-0'
          }`}
        >
          <li className="seo-settings-sidebar-list-item" onClick={() => setActiveTab('page')}>
            {activeTab == 'page' && <Eye />}
            <p>Page</p>
          </li>
          <li className="seo-settings-sidebar-list-item" onClick={() => setActiveTab('post')}>
            {activeTab == 'post' && <Eye />}
            <p>Post</p>
          </li>
        </ul>
      </div>
      <div className="w-full">
        <div
          className={`seo-settings-sidebar-block-heaer-end ${
            expanded.find((item) => item.name == 'social').expanded ? '' : 'rounded-b'
          } border-r border-gray-200 cursor-pointer`}
          onClick={() =>
            updateExpanded(
              'social',
              expanded.find((item) => item.name == 'social').expanded ? false : true,
            )
          }
        >
          <div>Social</div>

          <Chevrons expanded={expanded} itemName="social" />
        </div>
        <ul
          className={`seo-settings-sidebar-list ${
            expanded.find((item) => item.name === 'social').expanded ? 'max-h-96' : 'max-h-0'
          }`}
        >
          <li
            className={`seo-settings-sidebar-list-item-last  ${
              expanded.find((item) => item.name == 'social').expanded ? 'rounded-b' : ''
            } flex flex-row items-center gap-2 text-gray-800 hover:text-blue-500 cursor-pointer`}
            onClick={() => setActiveTab('social_settings')}
          >
            {activeTab == 'social_settings' && <Eye />}
            <p>Social Settings</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
