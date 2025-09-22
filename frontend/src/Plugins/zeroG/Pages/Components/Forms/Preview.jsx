import React from 'react';

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
            <FaCode className="w-6" /> HTML Content
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

const Preview = ({ fields, formTitle }) => {
  return (
    <div className="bg-white h-full p-4">
      <div className="p-4 bg-[#eeebf5] rounded">
        <p className="px-4 py-2 font-bold">{formTitle}</p>
        <div className="px-4 py-2">
          {fields.map((field, index) => (
            <div key={index} className={`p-3 mb-2 bg-white rounded shadow`}>
              <div className="flex flex-row items-center justify-between">
                <div className="mb-1 font-semibold">
                  {field.label} {field.required && <span className="text-red-800">*</span>}
                </div>
              </div>
              {renderField(field)}
            </div>
          ))}
          <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded self-end" disabled>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Preview;
