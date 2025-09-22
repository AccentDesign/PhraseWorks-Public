import React from 'react';

const AddressFieldOption = ({
  formItems,
  setFormItems,
  selectedField,
  name,
  placeHolder,
  label,
}) => {
  const currentItem = formItems.find((item) => item.id === selectedField);
  const addressFields = currentItem?.addressFields || {};
  const isEnabled = addressFields?.[name] !== false;
  return (
    <div className="flex items-center space-x-3 mb-2">
      <button
        type="button"
        role="switch"
        aria-checked={isEnabled}
        onClick={() => {
          const updatedItems = formItems.map((item) => {
            if (item.id === selectedField) {
              const currentAddressFields = item.addressFields || {};
              const currentValue = currentAddressFields[name] !== false;
              return {
                ...item,
                addressFields: {
                  ...currentAddressFields,
                  [name]: !currentValue,
                },
              };
            }
            return item;
          });
          setFormItems(updatedItems);
        }}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          isEnabled ? 'bg-blue-600' : 'bg-gray-300'
        }`}
      >
        <span
          aria-hidden="true"
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            isEnabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>

      <label className="text-sm text-gray-700">{addressFields?.[`${name}Label`] || label}</label>

      <input
        name={name}
        placeholder={placeHolder}
        value={
          formItems.find((item) => item.id === selectedField)?.addressFields?.[`${name}Label`] || ''
        }
        onChange={(e) => {
          const updatedItems = formItems.map((item) =>
            item.id === selectedField
              ? {
                  ...item,
                  addressFields: {
                    ...item.addressFields,
                    [`${name}Label`]: e.target.value,
                  },
                }
              : item,
          );
          setFormItems(updatedItems);
        }}
        className="border p-2 rounded w-full"
      />
    </div>
  );
};

export default AddressFieldOption;
