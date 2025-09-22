import React, { useContext } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIConnectorContext } from '../../../../Contexts/APIConnectorContext';
import PageHeader from './Forms/PageHeader';
import PageContent from './Forms/PageContent';
import { APIAddGForm } from '../../API/APIForms';

const AddPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const navigate = useNavigate();
  const [formTitle, setFormTitle] = useState('');
  const [formItems, setFormItems] = useState([]);
  const [selectedField, setSelectedField] = useState(null);

  const saveForm = async () => {
    const data = await APIAddGForm(loginPassword, formTitle, formItems);
    if (data.status == 200) {
      if (data.data.addGForm.success) {
        navigate(`/admin/zero-g/edit/${data.data.addGForm.post_id}`);
      }
    }
  };
  return (
    <div className="flex flex-col h-screen">
      <PageHeader
        formTitle={formTitle}
        setFormTitle={setFormTitle}
        saveForm={saveForm}
        formId={null}
        selectedField={selectedField}
        setSelectedField={setSelectedField}
      />
      <PageContent
        formItems={formItems}
        setFormItems={setFormItems}
        selectedField={selectedField}
        setSelectedField={setSelectedField}
        className="flex-1"
      />
    </div>
  );
};

export default AddPageContent;
