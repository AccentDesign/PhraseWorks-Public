import React from 'react';
import SidebarItems from './SidebarItems';

const SidebarSection = ({
  isFirst,
  isLast,
  items,
  updateExpanded,
  expanded,
  activeTab,
  setActiveTab,
  slug,
  name,
}) => {
  return (
    <>
      {isFirst ? (
        <div className="w-full">
          <div
            className="seo-settings-sidebar-block-header"
            onClick={() =>
              updateExpanded(
                slug,
                expanded.find((item) => item.name == slug).expanded ? false : true,
              )
            }
          >
            <div>{name}</div>

            {expanded.find((item) => item.name == slug).expanded ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                className="seo-settings-sidebar-chevron w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                className="seo-settings-sidebar-chevron w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            )}
          </div>
          <SidebarItems
            expanded={expanded}
            sectionName={slug}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            items={items}
          />
        </div>
      ) : isLast ? (
        <div className="w-full">
          <div
            className={`seo-settings-sidebar-block-heaer-end ${
              expanded.find((item) => item.name == slug).expanded ? '' : 'rounded-b'
            } border-r border-gray-200 cursor-pointer`}
            onClick={() =>
              updateExpanded(
                slug,
                expanded.find((item) => item.name == slug).expanded ? false : true,
              )
            }
          >
            <div>{name}</div>
            {expanded.find((item) => item.name == slug).expanded ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                className="seo-settings-sidebar-chevron w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                className="seo-settings-sidebar-chevron w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            )}
          </div>
          <SidebarItems
            expanded={expanded}
            sectionName={slug}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            items={items}
          />
        </div>
      ) : (
        <div className="w-full">
          <div
            className="seo-settings-sidebar-block-header-mid"
            onClick={() =>
              updateExpanded(
                slug,
                expanded.find((item) => item.name == slug).expanded ? false : true,
              )
            }
          >
            <div>{name}</div>
            {expanded.find((item) => item.name == slug).expanded ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                className="seo-settings-sidebar-chevron w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                className="seo-settings-sidebar-chevron w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            )}
          </div>
          <SidebarItems
            expanded={expanded}
            sectionName={slug}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            items={items}
          />
        </div>
      )}
    </>
  );
};

export default SidebarSection;
