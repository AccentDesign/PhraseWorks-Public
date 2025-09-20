import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useContext, useState } from 'react';
import { APIConnectorContext } from '../../../../Contexts/APIConnectorContext.jsx';
import { notify } from '../../../../Utils/Notification.jsx';
import { APIAddTheme } from '../../../../API/APISystem.js';

const AddPanel = ({ addSliderOpen, setAddSliderOpen, HandleClose, setReloadThemes }) => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  const submitCreate = async () => {
    const data = await APIAddTheme(loginPassword, name, location);
    if (data.status == 200) {
      if (data.data.addTheme.success == true) {
        setReloadThemes(true);
        setAddSliderOpen(false);
        setName('');
        setLocation('');
        notify('Successfully created theme entry.', 'success');
        return;
      }
    }
    notify('Failed to create theme entry.', 'error');
  };

  return (
    <Transition.Root show={addSliderOpen} as={Fragment}>
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
                              Add Page Template
                            </Dialog.Title>
                            <div className="slide-panel-close-wrapper">
                              <button
                                type="button"
                                className="slide-panel-close-btn"
                                onClick={() => {
                                  setAddSliderOpen(false);
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
                          <div className="w-full">
                            <label>Name</label>
                            <input
                              type="text"
                              name="name"
                              placeholder="Name"
                              autoComplete="Name"
                              value={name}
                              className="input"
                              required
                              onChange={(e) => {
                                setName(e.target.value);
                              }}
                            />
                          </div>
                          <div className="w-full mt-4">
                            <label>Location</label>
                            <input
                              type="text"
                              name="location"
                              placeholder="Location"
                              autoComplete="Location"
                              value={location}
                              className="input"
                              required
                              onChange={(e) => {
                                setLocation(e.target.value);
                              }}
                            />
                            <p className="text-sm text-gray-500">Example: `/Content/Theme`</p>
                          </div>
                          <div className="flex flex-row justify-end mt-4">
                            <button
                              type="button"
                              className="text-white bg-blue-700 hover:bg-blue-800 btn"
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
