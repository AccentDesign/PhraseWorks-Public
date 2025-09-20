import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { notify } from '../../../../Utils/Notification.jsx';
import { APIConnectorContext } from '../../../../Contexts/APIConnectorContext';
import { APIUpdateTheme } from '../../../../API/APISystem';

const EditPanel = ({
  editSliderOpen,
  setEditSliderOpen,
  HandleClose,
  themeToEdit,
  setThemeToEdit,
  setReloadThemes,
}) => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  const submitUpdate = async () => {
    const data = await APIUpdateTheme(loginPassword, name, location, themeToEdit.id);
    if (data.status == 200) {
      if (data.data.updateTheme.success == true) {
        setReloadThemes(true);
        setEditSliderOpen(false);
        setThemeToEdit(null);
        notify('Successfully updated theme.', 'success');
        return;
      }
    }
    false;
  };

  useEffect(() => {
    if (themeToEdit) {
      setName(themeToEdit?.name);
      setLocation(themeToEdit?.location);
    }
  }, [themeToEdit]);

  return (
    <Transition.Root show={editSliderOpen} as={Fragment}>
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
                              Edit Theme
                            </Dialog.Title>
                            <div className="slide-panel-close-wrapper">
                              <button
                                type="button"
                                className="slide-panel-close-btn"
                                onClick={() => {
                                  setEditSliderOpen(false);
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
                          </div>

                          <div className="flex flex-row justify-end mt-4">
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

export default EditPanel;
