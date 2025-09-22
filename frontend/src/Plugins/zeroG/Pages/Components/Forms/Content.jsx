import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';

const renderField = (field) => {
  switch (field.type) {
    case 'text':
      return (
        <input
          type="text"
          placeholder={field.label}
          className="border p-2 rounded w-full"
          value={field.defaultValue ? field.defaultValue : ''}
          disabled
        />
      );
    case 'textarea':
      return (
        <textarea
          placeholder={field.label}
          className="border p-2 rounded w-full"
          value={field.defaultValue ? field.defaultValue : ''}
          disabled
        />
      );
    case 'dropdown':
      return (
        <select className="border p-2 rounded w-full" placeholder="First choice" disabled>
          {field.choices.length > 0 && <option value="">{field.choices[0].value}</option>}
        </select>
      );
    case 'number':
      return (
        <input
          type="number"
          placeholder={field.label}
          className="border p-2 rounded w-full"
          value={field.defaultValue ? field.defaultValue : ''}
          disabled
        />
      );
    case 'checkbox':
      return (
        <div>
          {field.choices.length == 0 ? (
            <>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="choice" value="first" disabled />
                First Choice
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="choice" value="second" disabled />
                Second Choice
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="choice" value="third" disabled />
                Third Choice
              </label>
            </>
          ) : (
            field.choices.map((choice, idx) => (
              <label key={idx} className="flex items-center gap-2">
                <input type="checkbox" name="choice" value={choice.value} disabled />
                {choice.value}
              </label>
            ))
          )}
        </div>
      );
    case 'radio':
      return (
        <div>
          {field?.choices.length == 0 ? (
            <>
              <label className="flex items-center gap-2">
                <input type="radio" name="choice" value="first" />
                First Choice
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="choice" value="second" />
                Second Choice
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="choice" value="third" />
                Third Choice
              </label>
            </>
          ) : (
            field.choices.map((choice, idx) => (
              <label key={idx} className="flex items-center gap-2">
                <input type="radio" name="choice" value={choice.value} disabled />
                {choice.value}
              </label>
            ))
          )}
        </div>
      );
    case 'hidden':
      return (
        <input
          type="text"
          placeholder={field.label}
          value={field.defaultValue ? field.defaultValue : ''}
          className="border p-2 rounded w-full"
          disabled
        />
      );
    case 'html':
      return (
        <div>
          <h2 className="flex flex-row items-center gap-2 font-bold">
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 640 512"
              height="200px"
              width="200px"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
            >
              <path d="M278.9 511.5l-61-17.7c-6.4-1.8-10-8.5-8.2-14.9L346.2 8.7c1.8-6.4 8.5-10 14.9-8.2l61 17.7c6.4 1.8 10 8.5 8.2 14.9L293.8 503.3c-1.9 6.4-8.5 10.1-14.9 8.2zm-114-112.2l43.5-46.4c4.6-4.9 4.3-12.7-.8-17.2L117 256l90.6-79.7c5.1-4.5 5.5-12.3.8-17.2l-43.5-46.4c-4.5-4.8-12.1-5.1-17-.5L3.8 247.2c-5.1 4.7-5.1 12.8 0 17.5l144.1 135.1c4.9 4.6 12.5 4.4 17-.5zm327.2.6l144.1-135.1c5.1-4.7 5.1-12.8 0-17.5L492.1 112.1c-4.8-4.5-12.4-4.3-17 .5L431.6 159c-4.6 4.9-4.3 12.7.8 17.2L523 256l-90.6 79.7c-5.1 4.5-5.5 12.3-.8 17.2l43.5 46.4c4.5 4.9 12.1 5.1 17 .6z"></path>
            </svg>{' '}
            HTML Content
          </h2>
          <p>
            This is a content placeholder. HTML content is not displayed in the form admin. Preview
            this form to view the content.
          </p>
        </div>
      );
    case 'section':
      return (
        <div>
          <hr />
        </div>
      );
    case 'name':
      return (
        <div className="flex flex-row items-center gap-2">
          <input
            type="text"
            placeholder="First Name"
            className="border p-2 rounded w-full"
            disabled
          />
          <input
            type="text"
            placeholder="Last Name"
            className="border p-2 rounded w-full"
            disabled
          />
        </div>
      );
    case 'date':
      return (
        <select
          type="date"
          className="border rounded px-2 py-1"
          value={field.dateFormat ? field.dateFormat : 'dmy'}
          disabled
        >
          <option value="mdy">mm/dd/yyyy</option>
          <option value="dmy">dd/mm/yyyy</option>
          <option value="dmy_dash">dd-mm-yyyy</option>
          <option value="dmy_dot">dd.mm.yyyy</option>
          <option value="ymd_slash">yyyy/mm/dd</option>
          <option value="ymd_dash">yyyy-mm-dd</option>
          <option value="ymd_dot">yyyy.mm.dd</option>
        </select>
      );
    case 'time':
      return <input type="time" className="border rounded px-2 py-1" disabled />;
    case 'phone':
      return (
        <input
          type="tel"
          className="border rounded px-2 py-1 w-full"
          placeholder="Enter phone number"
          disabled
        />
      );
    case 'address':
      return (
        <div className="flex flex-col">
          {field.addressFields.street_address && (
            <div className="flex flex-col w-full mb-2">
              <input
                type="text"
                placeholder="Street Address"
                className="border p-2 rounded w-full"
                disabled
              />
              <label className="text-gray-500">{field.addressFields.street_addressLabel}</label>
            </div>
          )}
          {field.addressFields.address_line_2 && (
            <div className="flex flex-col w-full mb-2">
              <input
                type="text"
                placeholder="Address Line 2"
                className="border p-2 rounded w-full"
                disabled
              />
              <label className="text-gray-500">{field.addressFields.address_line_2Label}</label>
            </div>
          )}
          {(field.addressFields.city || field.addressFields.county) && (
            <div className="flex flex-col w-full mb-2">
              <div className="flex flex-row items-center gap-2">
                {field.addressFields.city && (
                  <div className="flex flex-col w-full">
                    <input
                      type="text"
                      placeholder="City"
                      className="border p-2 rounded w-full"
                      disabled
                    />
                    <label className="text-gray-500">{field.addressFields.cityLabel}</label>
                  </div>
                )}
                {field.addressFields.city && (
                  <div className="flex flex-col w-full mb-2">
                    <input
                      type="text"
                      placeholder="County/State/Region"
                      className="border p-2 rounded w-full"
                      disabled
                    />
                    <label className="text-gray-500">{field.addressFields.countyLabel}</label>
                  </div>
                )}
              </div>
            </div>
          )}
          {(field.addressFields.postcode || field.addressFields.country) && (
            <div className="flex flex-col w-full mb-2">
              <div className="flex flex-row items-center gap-2">
                {field.addressFields.postcode && (
                  <div className="flex flex-col w-full">
                    <input
                      type="text"
                      placeholder="ZIP/Postcode"
                      className="border p-2 rounded w-full"
                      disabled
                    />
                    <label className="text-gray-500">{field.addressFields.postcodeLabel}</label>
                  </div>
                )}
                {field.addressFields.country && (
                  <div className="flex flex-col w-full">
                    <input
                      type="text"
                      placeholder="Country"
                      className="border p-2 rounded w-full"
                      disabled
                    />
                    <label className="text-gray-500">{field.addressFields.countryLabel}</label>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    case 'website':
      return (
        <input
          type="url"
          className="border rounded px-2 py-1 w-full"
          placeholder="https://example.com"
          disabled
        />
      );
    case 'email':
      return (
        <input
          type="email"
          className="border rounded px-2 py-1 w-full"
          placeholder="email@example.com"
          disabled
        />
      );
    case 'upload':
      return <input type="file" disabled className="cursor-not-allowed opacity-50" />;
    default:
      return null;
  }
};

const Content = ({ formItems, setFormItems, selectedField, setSelectedField }) => {
  return (
    <div className="flex flex-row justify-start items-start gap-4 p-4 w-full">
      <Droppable droppableId="FORM_CONTENT">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`border p-4 rounded min-h-[300px] w-full ${
              snapshot.isDraggingOver ? 'bg-blue-50' : ''
            }`}
          >
            {formItems.length === 0 && (
              <div className=" mt-2 p-4 text-gray-500">Drag fields here to build your form</div>
            )}

            {formItems.map((field, index) => (
              <Draggable key={field.id} draggableId={field.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`p-3 mb-2 bg-white rounded shadow ${
                      snapshot.isDragging ? 'bg-blue-100' : ''
                    }
                    ${selectedField == field.id ? 'border-l-8 border-blue-600' : ''}`}
                    onClick={() => {
                      setSelectedField(field.id);
                    }}
                  >
                    <div className="flex flex-row items-center justify-between">
                      <div className="mb-1 font-semibold">
                        {field.label} {field.required && <span className="text-red-800">*</span>}
                      </div>
                      <button
                        className="text-red-800 hover:text-red-600"
                        onClick={() => {
                          setFormItems(formItems.filter((item) => item.id != field.id));
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                    {renderField(field)}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded self-end" disabled>
              Submit
            </button>
          </div>
        )}
      </Droppable>

      {/* PALETTE - static droppable, items draggable */}
    </div>
  );
};

export default Content;
