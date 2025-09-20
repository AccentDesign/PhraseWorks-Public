import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import TypeSelect from './TypeSelect';
import FieldData from './FieldData';

const AddPanel = ({ sliderAddOpen, setSliderAddOpen, HandleClose, fields, setFields }) => {
  const [type, setType] = useState('');
  const [fieldData, setFieldData] = useState(null);
  const [updateFields, setUpdateFields] = useState(false);

  useEffect(() => {
    if (updateFields && fieldData) {
      setUpdateFields(false);

      setFields((prevFields) => {
        const index = prevFields.findIndex((f) => f.name === fieldData.name);

        if (index !== -1) {
          const updatedFields = [...prevFields];
          updatedFields[index] = { ...updatedFields[index], ...fieldData };
          return updatedFields;
        } else {
          const newField = {
            order: prevFields.length + 1,
            ...fieldData,
          };
          return [...prevFields, newField];
        }
      });
      setFieldData(null);
      setType('');
      setSliderAddOpen(false);
    }
  }, [updateFields, fieldData]);

  return (
    <Transition.Root show={sliderAddOpen} as={Fragment}>
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
                              Add Field
                            </Dialog.Title>
                            <div className="ml-3 flex h-7 items-center">
                              <button
                                type="button"
                                className={`relative rounded-md text-gray-400 hover:text-gray-500`}
                                onClick={() => {
                                  setSliderAddOpen(false);
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
                          <div className="mt-4">
                            <p>Type</p>
                            <TypeSelect type={type} setType={setType} isUpdate={false} />
                            {type != '' && (
                              <FieldData
                                type={type}
                                fieldData={fieldData}
                                setFieldData={setFieldData}
                                setUpdateFields={setUpdateFields}
                              />
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

export default AddPanel;
