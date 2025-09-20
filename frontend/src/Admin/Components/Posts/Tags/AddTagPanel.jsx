import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { APIConnectorContext } from '../../../../Contexts/APIConnectorContext.jsx';
import { APICreatePostTag } from '../../../../API/APIPosts';
import { notify } from '../../../../Utils/Notification.jsx';

const AddTagPanel = ({ addTagSliderOpen, setAddTagSliderOpen, HandleClose, setReloadTags }) => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  const submitCreate = async () => {
    const data = await APICreatePostTag(loginPassword, name, slug, description);
    if (data.status == 200) {
      if (data.data.createPostTag.success == true) {
        setReloadTags(true);
        setAddTagSliderOpen(false);
        notify('Successfully created tag.', 'success');
        return;
      }
    }
    notify('Failed to create tag.', 'error');
  };

  useEffect(() => {
    const slugVar = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with dashes
      .replace(/-+/g, '-');
    setSlug(slugVar);
  }, [name]);

  return (
    <Transition.Root show={addTagSliderOpen} as={Fragment}>
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
                  <div className="px-4 sm:px-6">
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      <div className="flex items-start justify-start">
                        <div className="w-full">
                          <div className="flex items-start justify-between w-full pt-3">
                            <Dialog.Title
                              className={`text-gray-900 text-base font-semibold leading-6`}
                            >
                              Add Tag
                            </Dialog.Title>
                            <div className="ml-3 flex h-7 items-center">
                              <button
                                type="button"
                                className={`relative rounded-md text-gray-400 hover:text-gray-500`}
                                onClick={() => {
                                  setAddTagSliderOpen(false);
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
                            <label>Slug</label>
                            <input
                              type="text"
                              name="slug"
                              placeholder="Slug"
                              autoComplete="Slug"
                              value={slug}
                              className="input"
                              required
                              onChange={(e) => {
                                setSlug(e.target.value);
                              }}
                            />
                          </div>
                          <div className="w-full mt-4">
                            <label>Description</label>
                            <textarea
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              className="w-full h-64 p-2 bg-gray-50  border border-gray-300 rounded font-mono text-sm"
                              placeholder="Enter description here..."
                            />
                          </div>
                          <div className="flex flex-row justify-end">
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
                              Add Tag
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

export default AddTagPanel;
