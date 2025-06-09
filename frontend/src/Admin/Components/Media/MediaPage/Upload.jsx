import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { Fragment, useState } from 'react';

const Upload = ({
  sliderOpen,
  setSliderOpen,
  HandleClose,
  imgUrl,
  handleChange,
  SendData,
  fileInputRef,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = e.dataTransfer.files;
      // Manually assign the files to input element
      fileInputRef.current.files = files;
      handleChange({ target: { files } });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  return (
    <Transition.Root show={sliderOpen} as={Fragment}>
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
                                Add File
                              </Dialog.Title>
                              <div className="ml-3 flex h-7 items-center">
                                <button
                                  type="button"
                                  className={`bg-white relative rounded-md text-gray-400 hover:text-gray-500`}
                                  onClick={() => {
                                    setSliderOpen(false);
                                  }}
                                >
                                  <span className="absolute -inset-2.5" />
                                  <span className="sr-only">Close panel</span>
                                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                </button>
                              </div>
                            </div>
                            <div
                              className={`flex flex-row items-center p-4 mt-8 border-4 border-dashed rounded-md min-h-40 ${
                                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                              }`}
                              onDrop={handleDrop}
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                            >
                              <input
                                type="file"
                                multiple
                                ref={fileInputRef}
                                onChange={handleChange}
                              />
                              <button
                                className="ml-4 flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                                type="submit"
                                onClick={async () => {
                                  await SendData();
                                }}
                              >
                                Upload
                              </button>
                            </div>
                            {imgUrl && (
                              <img src={imgUrl} className="w-[150px]" alt="Uploaded Preview" />
                            )}
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

export default Upload;
