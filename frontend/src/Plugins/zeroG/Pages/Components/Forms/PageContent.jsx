import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import StandardFields from './StandardFields';
import AdvancedFields from './AdvancedFields';
import Content from './Content';
import { PALETTE_ITEMS } from './palette_items';
import ChoicesEditor from './ChoicesEditor';
import fieldDefinitions from './fieldDefinitions';
import AddressFieldOption from './AddressFieldOption';
import SidebarContent from './SidebarContent';
import ConditionalsPanel from './ConditionalsPanel';

const defaultAddressFields = {
  street_address: true,
  address_line_2: true,
  city: true,
  county: true,
  postcode: true,
  country: true,
  street_addressLabel: 'Street Address',
  address_line_2Label: 'Address Line 2',
  cityLabel: 'City',
  countyLabel: 'County / State',
  postcodeLabel: 'ZIP / Postal Code',
  countryLabel: 'Country',
};

const PageContent = ({ formItems, setFormItems, selectedField, setSelectedField }) => {
  const [showChoicePanel, setShowChoicePanel] = useState(false);
  const [showConditionalPanel, setShowConditionalPanel] = useState(false);
  const [openSections, setOpenSections] = useState({
    general: true,
    advanced: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === 'FORM_CONTENT') {
        const items = Array.from(formItems);
        const [removed] = items.splice(source.index, 1);
        items.splice(destination.index, 0, removed);

        setFormItems(items);
      }
      return;
    }
    if (source.droppableId === 'FIELD_PALETTE' && destination.droppableId === 'FORM_CONTENT') {
      const fieldToAdd = PALETTE_ITEMS.flatMap((section) => section.items).find(
        (field) => field.id === draggableId,
      );
      if (!fieldToAdd) return;

      const newField = {
        ...fieldToAdd,
        id: `${fieldToAdd.id}-${Date.now()}`,
        ...(fieldToAdd.choicesEnabled ? { choices: [] } : {}),
        ...(fieldToAdd.type === 'address' ? { addressFields: defaultAddressFields } : {}),
      };
      const newFormItems = Array.from(formItems);
      newFormItems.splice(destination.index, 0, newField);

      setFormItems(newFormItems);
    }
  };

  let selectedFieldTypeData = null;
  let isRequired = false;
  let showChoices = false;
  let fieldChoices = [];
  let selectedFieldType = '';
  let updateChoices = () => {};

  if (selectedField) {
    const selectedFieldObject = formItems.find((item) => item.id === selectedField);
    selectedFieldType = selectedFieldObject?.type;

    selectedFieldTypeData = PALETTE_ITEMS.flatMap((group) => group.items).find(
      (item) => item.type === selectedFieldType,
    );

    isRequired = selectedFieldObject?.required || false;
    showChoices = selectedFieldTypeData?.choicesEnabled === true;
    fieldChoices = selectedFieldObject?.choices || [];

    updateChoices = (updatedChoices) => {
      const updatedItems = formItems.map((item) =>
        item.id === selectedField ? { ...item, choices: updatedChoices } : item,
      );
      setFormItems(updatedItems);
    };
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-row h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <Content
            formItems={formItems}
            setFormItems={setFormItems}
            PALETTE_ITEMS={PALETTE_ITEMS}
            selectedField={selectedField}
            setSelectedField={setSelectedField}
          />
        </div>

        <div className="bg-white border-l border-gray-300 w-[350px] h-full overflow-y-auto">
          <div className="flex flex-row">
            <button
              className={`w-[50%] p-4 ${
                selectedField == null ? 'border-b-4 border-gray-500' : 'border-b border-gray-200'
              }`}
              onClick={() => {
                setSelectedField(null);
              }}
            >
              Add Fields
            </button>
            <button
              className={`w-[50%] p-4 ${
                selectedField != null ? 'border-b-4 border-gray-500' : 'border-b border-gray-200'
              }`}
            >
              Field Settings
            </button>
          </div>
          {selectedField === null ? (
            <>
              <div className="flex flex-row gap-6 p-4 border-b border-b-gray-300">
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-20"
                >
                  <path d="M7.904 17.563a1.2 1.2 0 0 0 2.228 .308l2.09 -3.093l4.907 4.907a1.067 1.067 0 0 0 1.509 0l1.047 -1.047a1.067 1.067 0 0 0 0 -1.509l-4.907 -4.907l3.113 -2.09a1.2 1.2 0 0 0 -.309 -2.228l-13.582 -3.904l3.904 13.563z"></path>
                </svg>
                <p>
                  Drag a field to the left to start building your form and then start configuring
                  it.
                </p>
              </div>
              <Droppable droppableId="FIELD_PALETTE" isDropDisabled={true}>
                {(provided) => (
                  <div
                    className="flex flex-col gap-2 p-4 flex-1 overflow-y-auto"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <StandardFields PALETTE_ITEMS={PALETTE_ITEMS} />
                    <AdvancedFields PALETTE_ITEMS={PALETTE_ITEMS} />
                  </div>
                )}
              </Droppable>
            </>
          ) : (
            <div className="flex flex-row gap-6 p-4 border-b border-b-gray-300">
              {(() => {
                const selectedFieldType = formItems.find((item) => item.id === selectedField)?.type;

                const matchedPaletteItem = PALETTE_ITEMS.flatMap((group) => group.items).find(
                  (item) => item.type === selectedFieldType,
                );

                return matchedPaletteItem
                  ? React.cloneElement(matchedPaletteItem.icon, {
                      className: 'w-20 h-20',
                    })
                  : null;
              })()}
              {(() => {
                const selectedFieldType = formItems.find((item) => item.id === selectedField)?.type;

                const def = fieldDefinitions.find((def) => def.type === selectedFieldType);

                return def ? <p className="whitespace-pre-line">{def.definition}</p> : null;
              })()}
            </div>
          )}
          <div className="p-4 border-b border-gray-300">
            <div className="flex flex-row items-center justify-between w-full">
              <p>General</p>
              <svg
                onClick={() => toggleSection('general')}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={`size-6 text-gray-400 transition-transform duration-200 ${
                  openSections.general ? 'rotate-180' : ''
                }`}
              >
                <path
                  fillRule="evenodd"
                  d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {openSections.general && (
              <>
                <div className="w-full mt-4">
                  <label>Field Label</label>
                  <input
                    type="text"
                    placeholder="Field Label"
                    className="mt-2 border p-2 rounded w-full"
                    value={formItems.find((item) => item.id === selectedField)?.label || ''}
                    onChange={(e) => {
                      const updatedItems = formItems.map((item) =>
                        item.id === selectedField ? { ...item, label: e.target.value } : item,
                      );
                      setFormItems(updatedItems);
                    }}
                  />
                </div>

                <div className="w-full mt-4">
                  <label>Description</label>
                  <textarea
                    placeholder="Paragraph Text"
                    className="border p-2 rounded w-full"
                    value={formItems.find((item) => item.id === selectedField)?.description || ''}
                    onChange={(e) => {
                      const updatedItems = formItems.map((item) =>
                        item.id === selectedField ? { ...item, description: e.target.value } : item,
                      );
                      setFormItems(updatedItems);
                    }}
                  ></textarea>
                </div>

                {selectedFieldType === 'html' && (
                  <div className="w-full mt-4">
                    <label>Content</label>
                    <textarea
                      placeholder="Paragraph Text"
                      className="border p-2 rounded w-full"
                      value={formItems.find((item) => item.id === selectedField)?.content || ''}
                      onChange={(e) => {
                        const updatedItems = formItems.map((item) =>
                          item.id === selectedField ? { ...item, content: e.target.value } : item,
                        );
                        setFormItems(updatedItems);
                      }}
                    ></textarea>
                  </div>
                )}

                {selectedFieldType === 'date' && (
                  <div className="w-full mt-4">
                    <label>Date Format</label>

                    <select
                      name="date_format"
                      value={formItems.find((item) => item.id === selectedField)?.dateFormat || ''}
                      onChange={(e) => {
                        const updatedItems = formItems.map((item) =>
                          item.id === selectedField
                            ? { ...item, dateFormat: e.target.value }
                            : item,
                        );
                        setFormItems(updatedItems);
                      }}
                      className="border p-2 rounded w-full"
                    >
                      <option value="mdy">mm/dd/yyyy</option>
                      <option value="dmy">dd/mm/yyyy</option>
                      <option value="dmy_dash">dd-mm-yyyy</option>
                      <option value="dmy_dot">dd.mm.yyyy</option>
                      <option value="ymd_slash">yyyy/mm/dd</option>
                      <option value="ymd_dash">yyyy-mm-dd</option>
                      <option value="ymd_dot">yyyy.mm.dd</option>
                    </select>
                  </div>
                )}

                {selectedFieldType === 'address' && (
                  <div className="w-full mt-4">
                    <AddressFieldOption
                      formItems={formItems}
                      setFormItems={setFormItems}
                      selectedField={selectedField}
                      name="street_address"
                      placeHolder="Street Address"
                      label="Street Address"
                    />
                    <AddressFieldOption
                      formItems={formItems}
                      setFormItems={setFormItems}
                      selectedField={selectedField}
                      name="address_line_2"
                      placeHolder="Address Line 2"
                      label="Address Line 2"
                    />
                    <AddressFieldOption
                      formItems={formItems}
                      setFormItems={setFormItems}
                      selectedField={selectedField}
                      name="city"
                      placeHolder="City"
                      label="City"
                    />
                    <AddressFieldOption
                      formItems={formItems}
                      setFormItems={setFormItems}
                      selectedField={selectedField}
                      name="county"
                      placeHolder="County / State"
                      label="County / State"
                    />
                    <AddressFieldOption
                      formItems={formItems}
                      setFormItems={setFormItems}
                      selectedField={selectedField}
                      name="postcode"
                      placeHolder="ZIP / Postal Code"
                      label="ZIP / Postal Code"
                    />
                    <AddressFieldOption
                      formItems={formItems}
                      setFormItems={setFormItems}
                      selectedField={selectedField}
                      name="country"
                      placeHolder="Country"
                      label="Country"
                    />
                  </div>
                )}

                <div className="w-full mt-4">
                  <div className="flex items-center">
                    <input
                      id="default-search"
                      type="checkbox"
                      value=""
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm"
                      checked={
                        formItems.find((item) => item.id == selectedField)?.required || false
                      }
                      onChange={(e) => {
                        const updatedItems = formItems.map((item) =>
                          item.id === selectedField
                            ? { ...item, required: e.target.checked }
                            : item,
                        );
                        setFormItems(updatedItems);
                      }}
                    />
                    <p className="ms-2 text-sm font-medium text-gray-900">
                      Required
                    </p>
                  </div>

                  {showChoices == true && (
                    <div className="flex items-center mt-4">
                      <p>Choices</p>
                      <button
                        onClick={() => {
                          setShowChoicePanel(true);
                        }}
                        className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
                      >
                        Edit Choices
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          <SidebarContent
            toggleSection={toggleSection}
            openSections={openSections}
            formItems={formItems}
            setFormItems={setFormItems}
            selectedField={selectedField}
          />{' '}
          <div className="p-4 border-b border-gray-300">
            <div className="flex flex-row items-center justify-between w-full">
              <div className="flex flex-row items-center gap-2">
                <p>Conditional Logic </p>
                {selectedField &&
                formItems.find((item) => item.id === selectedField)?.conditionalsEnabled ===
                  true ? (
                  <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
                    Active
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
                    Inactive
                  </span>
                )}
              </div>
              <svg
                onClick={() => setShowConditionalPanel(!showConditionalPanel)}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <path
                  fillRule="evenodd"
                  d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 0 1-.517.608 7.45 7.45 0 0 0-.478.198.798.798 0 0 1-.796-.064l-.453-.324a1.875 1.875 0 0 0-2.416.2l-.243.243a1.875 1.875 0 0 0-.2 2.416l.324.453a.798.798 0 0 1 .064.796 7.448 7.448 0 0 0-.198.478.798.798 0 0 1-.608.517l-.55.092a1.875 1.875 0 0 0-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 0 1-.064.796l-.324.453a1.875 1.875 0 0 0 .2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 0 1 .796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 0 1 .517-.608 7.52 7.52 0 0 0 .478-.198.798.798 0 0 1 .796.064l.453.324a1.875 1.875 0 0 0 2.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 0 1-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 0 0 1.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 0 1-.608-.517 7.507 7.507 0 0 0-.198-.478.798.798 0 0 1 .064-.796l.324-.453a1.875 1.875 0 0 0-.2-2.416l-.243-.243a1.875 1.875 0 0 0-2.416-.2l-.453.324a.798.798 0 0 1-.796.064 7.462 7.462 0 0 0-.478-.198.798.798 0 0 1-.517-.608l-.091-.55a1.875 1.875 0 0 0-1.85-1.566h-.344ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      {showChoicePanel && (
        <div className="fixed top-[45px] bottom-0 right-[350px] z-50 w-80 bg-white shadow-xl border-r border-gray-200 flex flex-col">
          <div className="flex justify-between items-center mb-4 px-4 pt-4">
            <h2 className="text-lg font-semibold">Choices</h2>
            <button
              onClick={() => setShowChoicePanel(false)}
              className="text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>
          <p className="border-b border-gray-400 pb-4 px-4">
            Define the choices for this field. If the field type supports it you will also be able
            to select the default choice(s) to the left of the choice.
          </p>

          {/* This wrapper now fills remaining space and makes ChoicesEditor fill it */}
          <div className="flex-1 px-4 pt-4 flex flex-col min-h-0">
            <ChoicesEditor choices={fieldChoices} setChoices={updateChoices} />
          </div>
        </div>
      )}
      {showConditionalPanel && (
        <ConditionalsPanel
          formItems={formItems}
          setFormItems={setFormItems}
          selectedId={selectedField}
          setShowConditionalPanel={setShowConditionalPanel}
        />
      )}
    </DragDropContext>
  );
};

export default PageContent;
