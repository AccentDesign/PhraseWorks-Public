import { Dialog, Transition } from '@headlessui/react';
import React, { useState } from 'react';
import { Fragment } from 'react';
import { APIRegeneratePlugins } from '@/API/APISystem';
import { useContext } from 'react';
import { createSafeSvgMarkup } from '@/Utils/sanitizeHtml';
import { APIConnectorContext } from '@/Contexts/APIConnectorContext';
import { APIGetPluginsRepo, APIInstallPlugin } from '../../../API/APISystem';
import { useEffect } from 'react';
import { notify } from '../../../Utils/Notification';

const AddPlugins = ({ sliderOpen, setSliderOpen, fetchData }) => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [plugins, setPlugins] = useState([]);

  const HandleClose = () => {};

  const installPlugin = async (url) => {
    const data = await APIInstallPlugin(loginPassword, url);
    if (data.status == 200) {
      fetchData();
      setSliderOpen(false);
      notify('Plugin Installed', 'success');
    }
  };

  const fetchDataAddPlugins = async () => {
    const data = await APIGetPluginsRepo();
    if (data.status == 200) {
      setPlugins(data.data.getPluginsRepo.plugins);
    }
  };

  useEffect(() => {
    fetchDataAddPlugins();
  }, []);

  return (
    <Transition.Root show={sliderOpen} as={Fragment}>
      <Dialog as="div" className="slide-panel" onClose={HandleClose}>
        <div className="fixed inset-0" />

        <div className="slide-panel-content-wrapper">
          <div className="slide-panel-content">
            <div className="slide-panel-content-inner">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="slide-panel-dialog-panel">
                  <div className="slide-panel-dialog-panel-inner px-4 sm:px-6">
                    <div className="slide-panel-dialog-relative">
                      <div className="flex-start">
                        <div className="w-full">
                          <div className="slide-panel-dialog-header-wrapper">
                            <Dialog.Title className="slide-panel-dialog-title">
                              Add Plugins
                            </Dialog.Title>
                            <div className="slide-panel-close-wrapper">
                              <button
                                type="button"
                                className="slide-panel-close-btn"
                                onClick={() => {
                                  setSliderOpen(false);
                                }}
                              >
                                <span className="absolute -inset-2.5" />
                                <span className="sr-only">Close panel</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  className="h-6 w-6"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18 18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 my-8">
                            {plugins.map((plugin, index) => (
                              <div
                                key={index}
                                className="border rounded p-4 flex flex-col items-center"
                              >
                                {/* Render SVG logo */}
                                <div
                                  className="w-24 h-24 mb-2"
                                  dangerouslySetInnerHTML={createSafeSvgMarkup(plugin.logo)}
                                />
                                {/* Show plugin title or something from plugin.data */}
                                <div className="text-center text-sm mb-2">
                                  {/* Assuming plugin.data is a JSON string, parse it */}
                                  <h2 className="text-2xl font-bold">
                                    {JSON.parse(plugin.data).title || 'No Title'}
                                  </h2>
                                  <p>{JSON.parse(plugin.data).version || 'No Version'}</p>
                                </div>
                                <div className="text-center mb-2">
                                  <p>{JSON.parse(plugin.data).description || 'No Description'}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    installPlugin(plugin.file);
                                  }}
                                  className="text-blue-600 hover:underline"
                                >
                                  Install Plugin
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default AddPlugins;
