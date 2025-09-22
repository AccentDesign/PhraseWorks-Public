import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { APIConnectorContext } from '@/Contexts/APIConnectorContext';
import { APIGetCustomFieldGroupsWhereMatch } from '../../../../../API/APICustomFields';

const AddField = ({ addSliderOpen, setAddSliderOpen, fields, onAddField, postType }) => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [type, setType] = useState('standardField');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [groups, setGroups] = useState([]);

  const HandleClose = () => {};

  const submitCreate = () => {
    if (!name || !title) return;

    const newField = {
      name,
      title,
      order: fields.length + 1,
    };

    onAddField(newField);
    setName('');
    setTitle('');
    setAddSliderOpen(false);
  };

  const fetchData = async () => {
    const groupsData = await APIGetCustomFieldGroupsWhereMatch(
      'post_type',
      'is_equal',
      postType,
      loginPassword,
    );

    if (groupsData.status == 200) {
      const groupsParsed = JSON.parse(groupsData.data.getCustomFieldGroupsWhereMatch);
      setGroups(groupsParsed);
    }
  };

  useEffect(() => {
    fetchData();
  }, [postType]);

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
                          <p className="pb-2">Field Type</p>
                          <select
                            name="consent_location"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="border rounded p-2 mb-2 w-full"
                          >
                            <option value="">Select a type</option>

                            <option value="manual">Manual</option>
                            <option value="standardField">Standard Field</option>
                            <option value="customField">Custom Field</option>
                          </select>
                          {type == 'manual' && (
                            <>
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
                                <label>Title</label>
                                <input
                                  type="text"
                                  name="title"
                                  placeholder="Title"
                                  autoComplete="Title"
                                  value={title}
                                  className="input"
                                  required
                                  onChange={(e) => {
                                    setTitle(e.target.value);
                                  }}
                                />
                              </div>
                            </>
                          )}
                          {type == 'standardField' && (
                            <>
                              <p className="pb-2">Field</p>
                              <select
                                name="name"
                                value={name}
                                onChange={(e) => {
                                  const selectedIndex = e.target.selectedIndex;
                                  const selectedOption = e.target.options[selectedIndex];

                                  setName(e.target.value);
                                  setTitle(selectedOption.text);
                                }}
                                className="border rounded p-2 mb-2 w-full"
                              >
                                <option value="">Select a field</option>

                                <option value="post_date">Post Date</option>
                                <option value="post_date_gmt">Post Date GMT</option>
                                <option value="post_content">Post Content</option>
                                <option value="post_title">Post Title</option>
                                <option value="post_excerpt">Post Excerpt</option>
                                <option value="post_status">Post Status</option>
                                <option value="post_name">Post Name</option>
                                <option value="post_modified">Post Date</option>
                                <option value="post_modified_gmt">Post Date GMT</option>
                                <option value="guid">GUID</option>
                                <option value="post_type">Post Type</option>
                                <option value="comment_count">Comment Count</option>
                                <option value="post_author">Post Author</option>
                              </select>
                            </>
                          )}

                          {type == 'customField' && (
                            <>
                              <p className="pb-2">Field</p>
                              <select
                                name="name"
                                value={name}
                                onChange={(e) => {
                                  const selectedIndex = e.target.selectedIndex;
                                  const selectedOption = e.target.options[selectedIndex];

                                  setName(e.target.value);
                                  setTitle(selectedOption.text);
                                }}
                                className="border rounded p-2 mb-2 w-full"
                              >
                                <option value="">Select a field</option>

                                {groups.map((group, groupIdx) =>
                                  group.fields.map((field, fieldIdx) => (
                                    <option key={`${groupIdx}-${fieldIdx}`} value={field.name}>
                                      {field.label}
                                    </option>
                                  )),
                                )}
                              </select>
                            </>
                          )}

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
                              Add Field
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

export default AddField;
