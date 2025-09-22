import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { APIGetGForm, APIUpdateGForm } from '../../API/APIForms';
import { APIConnectorContext } from '../../../../Contexts/APIConnectorContext';
import { notify } from '../../../../Utils/Notification';
import PageHeader from './Forms/PageHeader';
import SettingsLinks from './Settings/SettingsLinks';

const FormSettingsPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const { id } = useParams();
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formItems, setFormItems] = useState([]);

  const saveForm = async () => {
    const data = await APIUpdateGForm(loginPassword, id, formTitle, formDescription, formItems);
    if (data.status == 200) {
      if (data.data.updateGForm.success) {
        notify('Successfully updated the form', 'success');
      }
    }
  };

  const fetchData = async () => {
    const data = await APIGetGForm(id);
    if (data.status == 200) {
      if (data.data.getGForm) {
        setFormTitle(data.data.getGForm.title);
        setFormDescription(data.data.getGForm.description);
        setFormItems(data.data.getGForm.fields.fields);
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
        formId={id}
      />
      <div className="px-4">
        <div className="flex flex-col lg:flex-row  mt-8 gap-4">
          <SettingsLinks id={id} />
          <div className="shadow-md sm:rounded-lg flex-1">
            <div className="h-full w-full bg-white border border-gray-200 rounded flex flex-col">
              <p className="border-b border-gray-300 p-4 w-full">Form Basics</p>
              <div className="p-4">
                <p className="pb-2">
                  Form title <span className="text-red-800">(Required)</span>
                </p>
                <p className="pb-2">
                  <input
                    type="text"
                    name="form_title"
                    className="border p-2 rounded w-full"
                    placeholder="Form Title"
                    value={formTitle}
                    onChange={(e) => {
                      setFormTitle(e.target.value);
                    }}
                  />
                </p>
                <p className="pb-2">Form Description</p>
                <p className="">
                  <textarea
                    type="text"
                    name="form_description"
                    className="border p-2 rounded w-full"
                    value={formDescription}
                    onChange={(e) => {
                      setFormDescription(e.target.value);
                    }}
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormSettingsPageContent;
