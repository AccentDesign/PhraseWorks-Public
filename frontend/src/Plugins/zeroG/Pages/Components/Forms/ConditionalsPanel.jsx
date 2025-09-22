import React from 'react';

const ConditionalsPanel = ({ formItems, setFormItems, selectedId, setShowConditionalPanel }) => {
  const handleConditionalChange = (conditionalId, fieldKey, newValue) => {
    const updatedFormItems = formItems.map((field) => {
      if (field.id !== selectedId) return field;

      const updatedConditionals = (field.conditionals || []).map((c) => {
        if (c.id !== conditionalId) return c;

        const updated = { ...c, [fieldKey]: newValue };

        const container = document.querySelector(`[data-conditional-block="${conditionalId}"]`);
        if (container) {
          ['field', 'finder', 'choice', 'value'].forEach((key) => {
            if (!updated[key]) {
              const el = container.querySelector(`[data-${key}]`);
              if (el) updated[key] = el.value;
            }
          });
        }

        return updated;
      });

      return { ...field, conditionals: updatedConditionals };
    });

    setFormItems(updatedFormItems);
  };

  return (
    <div className="fixed top-[45px] bottom-0 right-[350px] z-50 w-full md:w-[600px] bg-white shadow-xl border-r border-gray-200 flex flex-col">
      <div className="flex justify-between items-center px-4 pt-4">
        <h2 className="text-lg font-semibold">Conditional Logic</h2>
        <button
          onClick={() => setShowConditionalPanel(false)}
          className="text-gray-500 hover:text-black"
        >
          ✕
        </button>
      </div>
      <div className="mb-4 px-4">
        <div className="w-full mt-4 flex flex-row items-center gap-2">
          <button
            onClick={() => {
              const updatedFields = formItems.map((field) =>
                field.id === selectedId
                  ? { ...field, conditionalsEnabled: !field.conditionalsEnabled }
                  : field,
              );

              setFormItems(updatedFields);
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
              selectedId &&
              formItems.find((item) => item.id === selectedId)?.conditionalsEnabled === true
                ? 'bg-green-500'
                : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                selectedId &&
                formItems.find((item) => item.id === selectedId)?.conditionalsEnabled === true
                  ? 'translate-x-5'
                  : 'translate-x-1'
              }`}
            />
          </button>
          Enable Conditional Logic
        </div>
        {selectedId &&
          formItems.find((item) => item.id === selectedId)?.conditionalsEnabled === true && (
            <>
              <div className="mt-4">
                <select
                  className="border p-2 rounded"
                  value={
                    formItems.find((item) => item.id === selectedId)?.conditionalsShow || 'show'
                  }
                  onChange={(e) => {
                    const updatedFormItems = formItems.map((field) =>
                      field.id === selectedId
                        ? { ...field, conditionalsShow: e.target.value }
                        : field,
                    );
                    setFormItems(updatedFormItems);
                  }}
                >
                  <option value="show">Show</option>
                  <option value="hide">Hide</option>
                </select>{' '}
                this field if{' '}
                <select
                  className="border p-2 rounded"
                  value={
                    formItems.find((item) => item.id === selectedId)?.conditionalsMatch || 'all'
                  }
                  onChange={(e) => {
                    const updatedFormItems = formItems.map((field) =>
                      field.id === selectedId
                        ? { ...field, conditionalsMatch: e.target.value }
                        : field,
                    );
                    setFormItems(updatedFormItems);
                  }}
                >
                  <option value="all">All</option>
                  <option value="any">Any</option>
                </select>{' '}
                of the following match:
              </div>
              {formItems
                .find((item) => item.id === selectedId)
                ?.conditionals.map((item, idx) => (
                  <div
                    key={item.id}
                    data-conditional-block={item.id}
                    className="mt-4 flex flex-row items-center justify-between gap-2"
                  >
                    <div className="flex flex-row items-center gap-2">
                      <select
                        data-field
                        value={item.field || ''}
                        className="border p-2 rounded"
                        onChange={(e) => handleConditionalChange(item.id, 'field', e.target.value)}
                      >
                        {formItems
                          .filter((item) => item.id != selectedId)
                          .map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.label}
                            </option>
                          ))}
                      </select>
                      <select
                        data-finder
                        value={item.finder || ''}
                        className="border p-2 rounded"
                        onChange={(e) => handleConditionalChange(item.id, 'finder', e.target.value)}
                      >
                        <option value="is">is</option>
                        <option value="isnot">is not</option>
                        <option value="greater">greater than</option>
                        <option value="less">less than</option>
                        <option value="contains">contains</option>
                        <option value="starts_with">starts with</option>
                        <option value="ends_with">ends with</option>
                      </select>
                      {formItems.find((formItem) => formItem.id === item.field)?.choices ? (
                        <select
                          data-choice
                          value={item.choice || ''}
                          className="border p-2 rounded"
                          onChange={(e) =>
                            handleConditionalChange(item.id, 'choice', e.target.value)
                          }
                        >
                          {formItems
                            .find((formItem) => formItem.id === item.field)
                            ?.choices.map((choice, idx) => (
                              <option key={idx} value={choice.value}>
                                {choice.value}
                              </option>
                            ))}
                        </select>
                      ) : (
                        <input
                          data-value
                          type="text"
                          value={item.value || ''}
                          placeholder="Enter a value"
                          className="border p-2 rounded w-full"
                          onChange={(e) =>
                            handleConditionalChange(item.id, 'value', e.target.value)
                          }
                        />
                      )}
                    </div>
                    <div className="flex flex-row items-center gap-2">
                      {idx > 0 && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 text-gray-400 hover:text-gray-600 cursor-pointer"
                          onClick={() => {
                            const updatedFormItems = formItems.map((field) => {
                              if (field.id !== selectedId) return field;

                              const updatedConditionals = (field.conditionals || []).filter(
                                (c) => c.id !== item.id,
                              );

                              return {
                                ...field,
                                conditionals: updatedConditionals,
                              };
                            });

                            setFormItems(updatedFormItems);
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      )}

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 text-gray-400 hover:text-gray-600 cursor-pointer"
                        onClick={() => {
                          const updatedFormItems = formItems.map((field) => {
                            if (field.id !== selectedId) return field;

                            const newConditional = {
                              id: crypto.randomUUID(),
                              fieldId: selectedId,
                              field: '',
                              finder: '',
                              value: '',
                              choice: '',
                            };

                            return {
                              ...field,
                              conditionals: [...(field.conditionals || []), newConditional],
                            };
                          });

                          setFormItems(updatedFormItems);
                        }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
            </>
          )}
      </div>
    </div>
  );
};

export default ConditionalsPanel;
