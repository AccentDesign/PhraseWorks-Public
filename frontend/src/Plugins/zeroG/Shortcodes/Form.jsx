import React, { useEffect, useState } from 'react';
import { APIAddEntryGForm, APIAddFormView, APIGetGForm } from '../API/APIForms';
import { Fragment } from 'react';
import { get_post_by } from '@/Includes/Posts';
import { notify } from '../../../Utils/Notification';
import { createSafeMarkup } from '@/Utils/sanitizeHtml';
import { useNavigate } from 'react-router-dom';
import { graphqlUrl } from '@/config';
import Loading from '@/Includes/Loading';
import { getCurrentPost } from '../../../Utils/PostStore';

async function callBackendAction(hook, args = []) {
  const res = await fetch(`${graphqlUrl}api/action/${hook}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ args }),
  });

  const data = await res.json();

  if (!data.success) {
    console.error('Hook failed:', data.error);
    return null;
  }

  return data.result;
}

const Form = ({ id, title, ...props }) => {
  const navigate = useNavigate();
  const [committing, setCommitting] = useState(false);
  const [fields, setFields] = useState([]);
  const [form, setForm] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [postId, setPostId] = useState(null);
  const [confirmations, setConfirmations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const pageLocation = props.currentPathSegment;
  const [errors, setErrors] = useState([]);
  const [initial, setInitial] = useState(true);

  const evaluateConditionals = (conditionals, formValues) => {
    if (!conditionals || conditionals.length === 0) return true;

    if (conditionals[0].field == '') return true;
    return conditionals.every((cond) => {
      const targetValue = formValues[cond.field];
      if (cond.value != '') {
        switch (cond.finder) {
          case 'is':
            return targetValue === cond.value;
          case 'is_not':
            return targetValue !== cond.value;
          case 'contains':
            return Array.isArray(targetValue) && targetValue.includes(cond.value);
          case 'not_contains':
            return Array.isArray(targetValue) && !targetValue.includes(cond.value);
          case 'greater_than':
            return parseFloat(targetValue) > parseFloat(cond.value);
          case 'less_than':
            return parseFloat(targetValue) < parseFloat(cond.value);
          default:
            return true;
        }
      } else {
        switch (cond.finder) {
          case 'is':
            return targetValue === cond.choice;
          case 'is_not':
            return targetValue !== cond.choice;
          case 'contains':
            return Array.isArray(targetValue) && targetValue.includes(cond.choice);
          case 'not_contains':
            return Array.isArray(targetValue) && !targetValue.includes(cond.choice);
          case 'greater_than':
            return parseFloat(targetValue) > parseFloat(cond.choice);
          case 'less_than':
            return parseFloat(targetValue) < parseFloat(cond.choice);
          default:
            return true;
        }
      }
    });
  };

  const renderField = (field, value, handleChange, fieldId, formValues, errors) => {
    const shouldRender = evaluateConditionals(field.conditionals, formValues);
    const error = errors.find((item) => item.id == field.id);
    if (!shouldRender) return null;
    switch (field.type) {
      case 'text':
        return (
          <div key={field.id} className="mb-4">
            <label>
              {field.label}
              {field.required && <span className="text-red-800"> *</span>}
            </label>
            <input
              type="text"
              placeholder={field.label}
              className="border p-2 rounded w-full"
              value={
                value !== undefined && value !== null && value !== ''
                  ? value
                  : field.defaultValue || ''
              }
              onChange={handleChange(fieldId)}
            />
            {error != undefined && (
              <p className="bg-red-100 p-4 rounded mt-2 text-red-800">{error.error}</p>
            )}
          </div>
        );
      case 'textarea':
        return (
          <div key={field.id} className="mb-4">
            <label>
              {field.label}
              {field.required && <span className="text-red-800"> *</span>}
            </label>
            <textarea
              placeholder={field.label}
              className="border p-2 rounded w-full"
              value={
                value !== undefined && value !== null && value !== ''
                  ? value
                  : field.defaultValue || ''
              }
              onChange={handleChange(field.id)}
            />
            {error != undefined && (
              <p className="bg-red-100 p-4 rounded mt-2 text-red-800">{error.error}</p>
            )}
          </div>
        );
      case 'number':
        return (
          <div key={field.id} className="mb-4">
            <label>
              {field.label}
              {field.required && <span className="text-red-800"> *</span>}
            </label>
            <input
              type="number"
              placeholder={field.label}
              className="border p-2 rounded w-full"
              value={
                value !== undefined && value !== null && value !== ''
                  ? value
                  : field.defaultValue || ''
              }
              onChange={handleChange(field.id)}
            />
            {error != undefined && (
              <p className="bg-red-100 p-4 rounded mt-2 text-red-800">{error.error}</p>
            )}
          </div>
        );
      case 'email':
        return (
          <div key={field.id} className="mb-4">
            <label>
              {field.label}
              {field.required && <span className="text-red-800"> *</span>}
            </label>
            <input
              type="email"
              placeholder={field.label}
              className="border p-2 rounded w-full"
              value={
                value !== undefined && value !== null && value !== ''
                  ? value
                  : field.defaultValue || ''
              }
              onChange={handleChange(field.id)}
            />
            {error != undefined && (
              <p className="bg-red-100 p-4 rounded mt-2 text-red-800">{error.error}</p>
            )}
          </div>
        );
      case 'checkbox':
        return (
          <div key={field.id} className="mb-4">
            <label>
              {field.label}
              {field.required && <span className="text-red-800"> *</span>}
            </label>
            {field.choices?.map((opt, idx) => (
              <label key={idx} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={opt.value}
                  checked={value?.includes(opt.value) || false}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    let newVal = value ? [...value] : [];
                    if (checked) newVal.push(opt.value);
                    else newVal = newVal.filter((v) => v !== opt.value);

                    handleChange(field.id)({ target: { value: newVal } });
                  }}
                />
                {opt.value}
              </label>
            ))}
            {error != undefined && (
              <p className="bg-red-100 p-4 rounded mt-2 text-red-800">{error.error}</p>
            )}
          </div>
        );
      case 'radio':
        return (
          <div key={field.id} className="mb-4">
            <label>{field.label}</label>
            {field.required && <span className="text-red-800"> *</span>}
            {field.choices?.map((opt, idx) => (
              <label key={idx} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={field.id}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={handleChange(field.id)}
                />
                {opt.value}
              </label>
            ))}
            {error != undefined && (
              <p className="bg-red-100 p-4 rounded mt-2 text-red-800">{error.error}</p>
            )}
          </div>
        );
      case 'name':
        return (
          <Fragment key={field.id}>
            <p>
              {field.label}
              {field.required && <span className="text-red-800"> *</span>}
            </p>
            <div key={field.id} className="mb-4 flex flex-row items-center gap-2">
              <div className="w-full md:w-1/2">
                <label>First Name</label>
                <input
                  type="text"
                  placeholder={field.label}
                  className="border p-2 rounded w-full"
                  value={
                    value !== undefined && value !== null && value !== ''
                      ? value
                      : field.defaultValue || ''
                  }
                  onChange={() => {
                    handleChange(field.id);
                    checkErrors(formValues);
                  }}
                />
              </div>
              <div className="w-full md:w-1/2">
                <label>Last Name</label>
                <input
                  type="text"
                  placeholder={field.label}
                  className="border p-2 rounded w-full"
                  value={
                    value !== undefined && value !== null && value !== ''
                      ? value
                      : field.defaultValue || ''
                  }
                  onChange={handleChange(field.id)}
                />
              </div>
            </div>
            {error != undefined && (
              <p className="bg-red-100 p-4 rounded mt-2 text-red-800">{error.error}</p>
            )}
          </Fragment>
        );
      case 'dropdown':
        return (
          <div className="mb-4" key={field.id}>
            <p>
              {field.label}
              {field.required && <span className="text-red-800"> *</span>}
            </p>
            <select className="border p-2 rounded w-full" placeholder="First choice">
              <option value="">Please select...</option>
              {field.choices.length > 0 &&
                field.choices.map((item, idx) => (
                  <option key={idx} value={item.id}>
                    {item.value}
                  </option>
                ))}
            </select>
            {error != undefined && (
              <p className="bg-red-100 p-4 rounded mt-2 text-red-800">{error.error}</p>
            )}
          </div>
        );
      case 'hidden':
        return (
          <div key={field.id}>
            <input
              type="text"
              placeholder={field.label}
              className="hidden"
              value={
                value !== undefined && value !== null && value !== ''
                  ? value
                  : field.defaultValue || ''
              }
              onChange={handleChange(field.id)}
            />
            {error != undefined && (
              <p className="bg-red-100 p-4 rounded mt-2 text-red-800">{error.error}</p>
            )}
          </div>
        );
      case 'html':
        return <div key={field.id} dangerouslySetInnerHTML={createSafeMarkup(field.content)} />;
      case 'section':
        return (
          <div className="mt-4" key={field.id}>
            <p>{field.label}</p>
            <div className="mt-2 mb-4 border-b border-gray-300" />
          </div>
        );

      case 'date': {
        // Convert from your stored format to yyyy-mm-dd for input value
        const toInputFormat = (value, format) => {
          if (!value) return '';
          const sep = format.includes('-') ? '-' : format.includes('.') ? '.' : '/';
          const parts = value.split(sep);
          if (parts.length !== 3) return '';

          let year, month, day;
          switch (format) {
            case 'mdy':
              [month, day, year] = parts;
              break;
            case 'dmy':
            case 'dmy_dash':
            case 'dmy_dot':
              [day, month, year] = parts;
              break;
            case 'ymd_slash':
            case 'ymd_dash':
            case 'ymd_dot':
              [year, month, day] = parts;
              break;
            default:
              return '';
          }
          if (month.length === 1) month = '0' + month;
          if (day.length === 1) day = '0' + day;
          return `${year}-${month}-${day}`;
        };

        const fromInputFormat = (value, format) => {
          if (!value) return '';
          const [year, month, day] = value.split('-');
          if (!year || !month || !day) return '';

          switch (format) {
            case 'mdy':
              return `${month}/${day}/${year}`;
            case 'dmy':
              return `${day}/${month}/${year}`;
            case 'dmy_dash':
              return `${day}-${month}-${year}`;
            case 'dmy_dot':
              return `${day}.${month}.${year}`;
            case 'ymd_slash':
              return `${year}/${month}/${day}`;
            case 'ymd_dash':
              return `${year}-${month}-${day}`;
            case 'ymd_dot':
              return `${year}.${month}.${day}`;
            default:
              return value;
          }
        };

        return (
          <div className="mt-4" key={field.id}>
            <p>{field.label}</p>
            <input
              type="date"
              className="border rounded p-2"
              value={toInputFormat(value, field.dateFormat)}
              onChange={(e) => {
                const val = e.target.value; // yyyy-mm-dd from native input
                const converted = fromInputFormat(val, field.dateFormat);
                handleChange(field.id)({ target: { value: converted } });
              }}
            />
          </div>
        );
      }
      case 'time':
        return (
          <div className="mt-4" key={field.id}>
            <p>{field.label}</p>
            <input
              type="time"
              className="border rounded p-2"
              value={
                value !== undefined && value !== null && value !== ''
                  ? value
                  : field.defaultValue || ''
              }
              onChange={handleChange(field.id)}
            />
            {error != undefined && (
              <p className="bg-red-100 p-4 rounded mt-2 text-red-800">{error.error}</p>
            )}
          </div>
        );
      case 'phone':
        return (
          <div className="mt-4" key={field.id}>
            <p>{field.label}</p>
            <input
              type="tel"
              className="border rounded p-2 w-full"
              placeholder="Enter phone number"
              value={
                value !== undefined && value !== null && value !== ''
                  ? value
                  : field.defaultValue || ''
              }
              onChange={handleChange(field.id)}
            />
            {error != undefined && (
              <p className="bg-red-100 p-4 rounded mt-2 text-red-800">{error.error}</p>
            )}
          </div>
        );
      case 'address':
        return (
          <div className="mt-4" key={field.id}>
            <p>{field.label}</p>
            <div className="flex flex-col">
              {field.addressFields.street_address && (
                <div className="flex flex-col w-full mb-2">
                  <input
                    type="text"
                    placeholder="Street Address"
                    className="border p-2 rounded w-full"
                    value={value?.street_address || ''}
                    onChange={handleChange(field.id, 'street_address')}
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
                        />
                        <label className="text-gray-500">{field.addressFields.countryLabel}</label>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {error != undefined && (
              <p className="bg-red-100 p-4 rounded mt-2 text-red-800">{error.error}</p>
            )}
          </div>
        );
      case 'website':
        return (
          <div key={field.id} className="mb-4">
            <label>
              {field.label}
              {field.required && <span className="text-red-800"> *</span>}
            </label>
            <input
              type="url"
              className="border rounded p-2 w-full"
              placeholder="https://example.com"
              value={
                value !== undefined && value !== null && value !== ''
                  ? value
                  : field.defaultValue || ''
              }
              onChange={handleChange(fieldId)}
            />
            {error != undefined && (
              <p className="bg-red-100 p-4 rounded mt-2 text-red-800">{error.error}</p>
            )}
          </div>
        );
      case 'upload':
        return (
          <div key={field.id} className="mb-4">
            <label>
              {field.label}
              {field.required && <span className="text-red-800"> *</span>}
            </label>
            <input
              type="file"
              className="block"
              value={
                value !== undefined && value !== null && value !== ''
                  ? value
                  : field.defaultValue || ''
              }
              onChange={handleChange(fieldId)}
            />
            {error != undefined && (
              <p className="bg-red-100 p-4 rounded mt-2 text-red-800">{error.error}</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      await APIAddFormView(id);

      const data = await APIGetGForm(id);
      const fetchedFields = data.data.getGForm.fields.fields || [];
      setFields(fetchedFields);
      setForm(data.data.getGForm);

      setConfirmations(JSON.parse(data.data.getGForm.confirmations));
      setNotifications(JSON.parse(data.data.getGForm.notifications));

      const initialValues = {};
      fetchedFields.forEach((f) => {
        if (f.type === 'checkbox') {
          initialValues[f.id] = [];
        } else if (f.type === 'address') {
          initialValues[f.id] = {
            street_address: '',
            address_line_2: '',
            city: '',
            county: '',
            postcode: '',
            country: '',
          };
        } else {
          initialValues[f.id] = '';
        }
      });
      setFormValues(initialValues);
      // const postData = await get_post_by('post_name', pageLocation);

      setPostId(getCurrentPost().id);
    };

    fetchData();
  }, [id, pageLocation]);

  const handleChange =
    (fieldId, subfield = null) =>
    (e) => {
      if (initial == true) {
        setInitial(false);
      }
      const value = e.target.value;

      setFormValues((prev) => {
        if (subfield) {
          return {
            ...prev,
            [fieldId]: {
              ...prev[fieldId],
              [subfield]: value,
            },
          };
        }
        return {
          ...prev,
          [fieldId]: value,
        };
      });
    };

  const checkErrors = (values) => {
    if (initial == false) {
      const tmpErrors = [];
      for (const key in values) {
        if (values.hasOwnProperty(key)) {
          const field = fields.find((item) => item.id == key);
          if (values[key] == '') {
            if (field.required == true) {
              tmpErrors.push({ id: field.id, error: 'Please fill in this field, it is required' });
            }
          }
        }
      }
      setErrors(tmpErrors);
      if (tmpErrors.length > 0) {
        return true;
      }
      return false;
    }
  };

  const saveEntry = async (formId, postId, values) => {
    if (initial == true) {
      setInitial(false);
    }
    const errorsExist = checkErrors(values);
    if (errorsExist == false) {
      setCommitting(true);
      const data = await APIAddEntryGForm(formId, postId, values);
      if (data.status == 200) {
        if (data.data.addEntryGForm.success) {
          await callBackendAction('send_zgform_notifications', [
            formId,
            notifications,
            values,
            JSON.stringify(fields),
          ]);
          const initialValues = {};
          fields.forEach((f) => {
            if (f.type === 'checkbox') {
              initialValues[f.id] = [];
            } else if (f.type === 'address') {
              initialValues[f.id] = {
                street_address: '',
                address_line_2: '',
                city: '',
                county: '',
                postcode: '',
                country: '',
              };
            } else {
              initialValues[f.id] = '';
            }
          });
          setFormValues(initialValues);

          notify('Form successfully submitted.', 'success');

          if (confirmations.some((item) => item.type === 'text')) {
            setShowConfirmation(true);
          } else if (confirmations.some((item) => item.type === 'page')) {
            const conf = confirmations.find((item) => item.type === 'page');
            const pageAsyncData = await get_post_by('id', conf.page);
            if (pageAsyncData?.guid) {
              navigate(pageAsyncData.guid);
            }
          } else if (confirmations.some((item) => item.type === 'redirect')) {
            const conf = confirmations.find((item) => item.type === 'redirect');
            if (conf?.redirectUrl) {
              window.location.href = conf.redirectUrl;
            }
          }

          setCommitting(false);
        }
      }
    }
  };

  useEffect(() => {
    checkErrors(formValues);
  }, [formValues, initial]);

  return (
    <>
      {form?.status == 'active' && (
        <div className="p-4 bg-[#eeebf5] rounded">
          {showConfirmation == false ? (
            <>
              {title === 'true' && <p className="text-xl font-bold mb-4">{form?.title}</p>}
              {fields.map((field) =>
                renderField(
                  field,
                  formValues[field.id],
                  handleChange,
                  field.id,
                  formValues,
                  errors,
                ),
              )}
              <button
                onClick={() => {
                  saveEntry(form.id, postId, formValues);
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
              >
                Submit
              </button>
            </>
          ) : (
            <>{confirmations.find((item) => item.type == 'text').message}</>
          )}
          {committing ? <Loading /> : ''}
        </div>
      )}
    </>
  );
};

export default Form;
