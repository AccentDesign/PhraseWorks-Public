import React, { useState } from 'react';
import TitleBar from './Docs/TitleBar';
import Sidebar from './Docs/Sidebar';
import Document from './Docs/Document';

const DocsPageContent = () => {
  const [expanded, setExpandedState] = useState([
    { name: 'getting-started', expanded: true },
    { name: 'plugins', expanded: false },
    { name: 'api', expanded: false },
    { name: 'deployment', expanded: false },
  ]);

  const items = [
    {
      slug: 'getting-started',
      name: 'Getting Started',
      items: [
        { slug: 'overview', name: 'Overview', mdfile: 'README' },
        { slug: 'quick-start', name: 'Quick Start', mdfile: 'getting-started/quick-start' },
        { slug: 'architecture', name: 'Architecture', mdfile: 'getting-started/architecture' },
      ],
    },
    {
      slug: 'plugins',
      name: 'Plugin Development',
      items: [
        { slug: 'plugin-guide', name: 'Development Guide', mdfile: 'plugins/development-guide' },
      ],
    },
    {
      slug: 'api',
      name: 'API Reference',
      items: [
        { slug: 'graphql-schema', name: 'GraphQL API', mdfile: 'api/graphql-schema' },
        { slug: 'pw-query', name: 'PW_Query', mdfile: 'api/pw-query' },
      ],
    },
    {
      slug: 'deployment',
      name: 'Deployment',
      items: [{ slug: 'production', name: 'Production Guide', mdfile: 'deployment/production' }],
    },
  ];

  const [activeTab, setActiveTab] = useState('overview');

  const updateExpanded = (type, value) => {
    const tmpExpanded = expanded.map((item) =>
      item.name === type ? { ...item, expanded: value } : item,
    );
    setExpandedState(tmpExpanded);
  };

  return (
    <>
      <TitleBar />
      <div className="panel mt-8 mt-8 flex flex-col lg:flex-row gap-4 !p-0">
        <div className="w-full lg:w-1/6 min-w-[200px] bg-gray-50 p-4">
          <Sidebar
            expanded={expanded}
            updateExpanded={updateExpanded}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            items={items}
          />
        </div>
        <div className="w-full lg:w-5/6 p-4">
          <Document activeTab={activeTab} items={items} />
        </div>
      </div>
    </>
  );
};

export default DocsPageContent;
