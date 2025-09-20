import React, { useEffect } from 'react';
import { get_plugin_page_components } from './utils';
import { useState } from 'react';
import { Suspense } from 'react';

const PluginComponents = ({ loginPassword, page }) => {
  const [pluginComponents, setPluginComponents] = useState([]);
  const [loadedComponents, setLoadedComponents] = useState({});
  const [expanded, setExpanded] = useState([]);

  const componentModules = import.meta.glob('../../Plugins/**/Components/*.jsx');

  const setCustomExpanded = (name, value) => {
    setExpanded((prevExpanded) =>
      prevExpanded.map((item) => (item.name === name ? { ...item, expanded: value } : item)),
    );
  };
  const fetchData = async () => {
    const pluginComponentsData = await get_plugin_page_components(loginPassword, page);
    setPluginComponents(pluginComponentsData);

    setExpanded(
      pluginComponentsData.map((component) => ({
        name: component.name,
        expanded: false,
      })),
    );

    const loaded = {};

    pluginComponentsData.forEach((component) => {
      const matchPath = `../../Plugins/${component.plugin}/Components/${component.name.replaceAll(
        ' ',
        '',
      )}.jsx`;
      const loader = componentModules[matchPath];

      if (loader) {
        loaded[component.name] = React.lazy(loader);
      } else {
        console.warn(`Component path not found in glob: ${matchPath}`);
      }
    });

    setLoadedComponents(loaded);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {pluginComponents.map((component, idx) => {
        const isExpanded = expanded.find((item) => item.name === component.name)?.expanded;
        const LoadedComponent = loadedComponents[component.name];

        return (
          <div key={idx} className="panel-no-pad mt-8">
            <div className="w-full bg-gray-200 p-4 flex flex-row items-center justify-between">
              <p>{component.name}</p>

              {isExpanded ? (
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  height="200px"
                  width="200px"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white hover:text-blue-500 cursor-pointer"
                  onClick={() => setCustomExpanded(component.name, false)}
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
                  className="text-white hover:text-blue-500 cursor-pointer"
                  onClick={() => setCustomExpanded(component.name, true)}
                >
                  <path
                    fillRule="evenodd"
                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              )}
            </div>

            {isExpanded && LoadedComponent && (
              <div className="p-4">
                <Suspense fallback={<p>Loading...</p>}>
                  <LoadedComponent />
                </Suspense>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PluginComponents;
