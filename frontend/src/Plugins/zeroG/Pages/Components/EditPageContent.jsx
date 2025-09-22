import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import PageHeader from './Forms/PageHeader';
import PageContent from './Forms/PageContent';
import { useEffect } from 'react';
import { APIGetGForm, APIUpdateGForm } from '../../API/APIForms';
import { APIConnectorContext } from '../../../../Contexts/APIConnectorContext';
import { notify } from '../../../../Utils/Notification';

const EditPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const { id } = useParams();
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formItems, setFormItems] = useState([]);
  const [selectedField, setSelectedField] = useState(null);

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
        const fields = data.data.getGForm.fields.fields;

        const updatedFields = fields.map((field) => {
          if (!field.conditionals || field.conditionals.length === 0) {
            return {
              ...field,
              conditionals: [
                {
                  id: crypto.randomUUID(),
                  fieldId: field.id,
                  field: '',
                  finder: '',
                  value: '',
                  choice: '',
                },
              ],
              conditionalsEnabled: false,
              conditionalsShow: 'show',
              conditionalsMatch: 'all',
            };
          }
          return field;
        });

        setFormItems(updatedFields);
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
        selectedField={selectedField}
        setSelectedField={setSelectedField}
      />
      <PageContent
        id={id}
        formItems={formItems}
        setFormItems={setFormItems}
        selectedField={selectedField}
        setSelectedField={setSelectedField}
        className="flex-1"
      />
    </div>
  );
};

export default EditPageContent;
