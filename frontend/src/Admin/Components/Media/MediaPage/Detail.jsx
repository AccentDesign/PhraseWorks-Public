import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { Fragment } from 'react';

const Detail = ({
  sliderDetailsOpen,
  setSliderDetailsOpen,
  HandleClose,
  files,
  detailsId,
  toggleCheckbox,
  setBulkAction,
  setApplyTriggered,
}) => {
  return (
    <Transition.Root show={sliderDetailsOpen} as={Fragment}>
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
                                File Details
                              </Dialog.Title>
                              <div className="ml-3 flex h-7 items-center">
                                <button
                                  type="button"
                                  className={`bg-white relative rounded-md text-gray-400 hover:text-gray-500`}
                                  onClick={() => {
                                    setSliderDetailsOpen(false);
                                  }}
                                >
                                  <span className="absolute -inset-2.5" />
                                  <span className="sr-only">Close panel</span>
                                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                </button>
                              </div>
                            </div>
                            <div className="mt-4">
                              {files
                                .filter((file) => file.id == detailsId)
                                .map((file) => (
                                  <div key={file.id} className="flex flex-row">
                                    <div className="w-1/2">
                                      <img src={file.url} className="w-full" />
                                    </div>
                                    <div className="w-1/2 pl-4">
                                      <p>
                                        <strong>Filename:</strong> {file.filename}
                                      </p>
                                      <p>
                                        <strong>Uploaded By:</strong> {file.author.user_login}
                                      </p>
                                      <p>
                                        <strong>Uploaded On:</strong>{' '}
                                        {new Date(file.date).toLocaleDateString()}
                                      </p>
                                      <hr className="my-4" />
                                      Inputs...
                                      <hr className="my-4" />
                                      <div className="flex flex-row items-center gap-4">
                                        <a
                                          href={file.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-500 text-sm"
                                        >
                                          View media file
                                        </a>
                                        <a
                                          href={file.url}
                                          download={file.filename || 'file'}
                                          className="text-blue-500 text-sm"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          Download file
                                        </a>

                                        <button
                                          type="button"
                                          className="text-red-500 text-sm cursor-pointer"
                                          onClick={() => {
                                            toggleCheckbox(file.id);
                                            setBulkAction('delete');
                                            setApplyTriggered(true);
                                          }}
                                        >
                                          Delete permanently
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
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

export default Detail;
