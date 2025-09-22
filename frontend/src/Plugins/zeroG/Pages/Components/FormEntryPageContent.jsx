import React, { useContext, useEffect, useState } from 'react';
import { APIGetGForm, APIUpdateGForm, APIGetEntries, APIGetEntry } from '../../API/APIForms';
import { APIConnectorContext } from '../../../../Contexts/APIConnectorContext';
import { notify } from '../../../../Utils/Notification';
import PageHeader from './Forms/PageHeader';
import { useParams } from 'react-router-dom';

const FormEntryPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const { formId, id } = useParams();
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formItems, setFormItems] = useState([]);
  const [entry, setEntry] = useState(null);
  const [form, setForm] = useState(null);
  const [entryFields, setEntryFields] = useState([]);

  const saveForm = async () => {
    const data = await APIUpdateGForm(loginPassword, id, formTitle, formDescription, formItems);
    if (data.status == 200) {
      if (data.data.updateGForm.success) {
        notify('Successfully updated the form', 'success');
      }
    }
  };

  const fetchData = async () => {
    const data = await APIGetGForm(formId);
    if (data.status == 200) {
      if (data.data.getGForm) {
        setFormTitle(data.data.getGForm.title);
        setFormDescription(data.data.getGForm.description);
        setFormItems(data.data.getGForm.fields.fields);
      }
    }
    const entryData = await APIGetEntry(loginPassword, id);
    if (entryData.status == 200) {
      if (entryData.data.getEntryGform) {
        setEntry(entryData.data.getEntryGform);
        setEntryFields(JSON.parse(entryData.data.getEntryGform.data));

        const formData = await APIGetGForm(entryData.data.getEntryGform.form_id);
        if (formData.status == 200) {
          setForm(formData.data.getGForm);
        }
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <PageHeader
        formTitle={formTitle}
        setFormTitle={setFormTitle}
        saveForm={saveForm}
        formId={formId}
      />
      <div className="px-4">
        <div className="flex flex-col lg:flex-row mt-8 gap-4">
          <div className="shadow-md sm:rounded-lg flex-1">
            <div className="w-full bg-white border border-gray-200 rounded flex flex-col justify-between">
              <p className="border-b border-gray-300 p-4 w-full">
                {entry?.form_title}: Entry #{entry?.id}
              </p>
              {form?.fields?.fields.map((field, index) => {
                const value = entryFields[field.id];
                const isLast = index === form.fields.fields.length - 1;

                return (
                  <div key={field.id}>
                    <p className="border-b border-gray-300 bg-gray-200 font-bold py-2 px-4">
                      {field.label}
                    </p>
                    <p className={`${!isLast ? 'border-b border-gray-300' : ''} py-2 px-4`}>
                      {value ? value : '-'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="shadow-md sm:rounded-lg">
            <div className="h-full w-full bg-white border border-gray-200 rounded flex flex-col">
              <p className="border-b border-gray-300 p-4 w-full">Entry</p>
              <p className="pt-4 px-4">Entry ID: </p>
              <p className="py-2 px-4">
                Submitted On:{' '}
                {entry?.date_created
                  ? new Intl.DateTimeFormat('en-GB', {
                      dateStyle: 'full',
                      timeStyle: 'medium',
                    }).format(new Date(entry.date_created))
                  : ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormEntryPageContent;
