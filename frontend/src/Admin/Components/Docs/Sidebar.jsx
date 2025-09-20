import React from 'react';

import SidebarSection from './SidebarSection';

const Sidebar = ({ expanded, updateExpanded, activeTab, setActiveTab, items }) => {
  return (
    <div className="seo-settings-sidebar mt-0">
      {items.map((item, idx) => (
        <SidebarSection
          key={idx}
          isFirst={idx == 0 ? true : false}
          isLast={idx == items.length - 1 ? true : false}
          items={item.items}
          updateExpanded={updateExpanded}
          expanded={expanded}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          slug={item.slug}
          name={item.name}
        />
      ))}
    </div>
  );
};

export default Sidebar;
