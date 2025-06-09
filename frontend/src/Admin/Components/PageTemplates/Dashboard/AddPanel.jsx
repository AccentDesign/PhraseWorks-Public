import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { Fragment, useContext, useState } from 'react';
import { APIConnectorContext } from '../../../../Contexts/APIConnectorContext.jsx';
import { notify } from '../../../../Utils/Notification.jsx';
import { APICreatePageTemplate } from '../../../../API/APIPageTemplates.js';

const AddPanel = ({ addSliderOpen, setAddSliderOpen, HandleClose, setReloadPageTemplates }) => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [name, setName] = useState('');
  const [fileName, setFileName] = useState('');

  const submitCreate = async () => {
    const data = await APICreatePageTemplate(loginPassword, name, fileName);
    if (data.status == 200) {
      if (data.data.createPostCategory.success == true) {
        setReloadPageTemplates(true);
        setAddSliderOpen(false);
        notify('Successfully created page template.', 'success');
        return;
      }
    }
    notify('Failed to create page template.', 'error');
  };

  return (
    <Transition.Root show={addSliderOpen} as={Fragment}>
      <Dialog as="div" className="relative z-30" onClose={HandleClose}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-7xl">
                  <div
                    className={`bg-white flex h-full flex-col overflow-y-scroll  py-6 shadow-2xl`}
                  >
                    <div className="px-4 sm:px-6">
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <div className="flex items-start justify-start">
                          <div className="w-full">
                            <div className="flex items-start justify-between w-full pt-3">
                              <Dialog.Title
                                className={`text-gray-900 text-base font-semibold leading-6`}
                              >
                                Add Page Template
                              </Dialog.Title>
                              <div className="ml-3 flex h-7 items-center">
                                <button
                                  type="button"
                                  className={`bg-white relative rounded-md text-gray-400 hover:text-gray-500`}
                                  onClick={() => {
                                    setAddSliderOpen(false);
                                  }}
                                >
                                  <span className="absolute -inset-2.5" />
                                  <span className="sr-only">Close panel</span>
                                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                </button>
                              </div>
                            </div>
                            <div className="w-full">
                              <label>Name</label>
                              <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                autoComplete="Name"
                                value={name}
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                                required
                                onChange={(e) => {
                                  setName(e.target.value);
                                }}
                              />
                            </div>
                            <div className="w-full mt-4">
                              <label>Filename</label>
                              <input
                                type="text"
                                name="filename"
                                placeholder="Filename"
                                autoComplete="Filename"
                                value={fileName}
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                                required
                                onChange={(e) => {
                                  setFileName(e.target.value);
                                }}
                              />
                            </div>
                            <div className="flex flex-row justify-end mt-4">
                              <button
                                type="button"
                                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                                onClick={submitCreate}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-5 mr-2"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Add Page Template
                              </button>
                            </div>
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

export default AddPanel;
