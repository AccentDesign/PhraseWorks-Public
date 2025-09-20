import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { parse, v4 as uuidv4 } from 'uuid';
import TitleBar from './CustomFieldsGroupsEdit/TitleBar';
import Fields from './CustomFieldsGroupsEdit/Fields';
import Settings from './CustomFieldsGroupsEdit/Settings';
import { APIConnectorContext } from '../../../Contexts/APIConnectorContext';
import { notify } from '../../../Utils/Notification';
import {
  APIGetCustomFieldGroupById,
  APIGetCustomFieldGroups,
  APIUpdateCustomFieldGroups,
} from '../../../API/APICustomFields';
import { APILogError } from '../../../API/APISystem';

const CustomFieldsGroupsEditPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [rules, setRules] = useState([]);
  const [active, setActive] = useState(true);
  const [fields, setFields] = useState([]);

  const triggerSave = async () => {
    if (name === '') {
      notify(`Field group 'Name' required.`, 'error');
      return;
    }

    const groupsData = await APIGetCustomFieldGroups(loginPassword);
    if (groupsData.status !== 200) {
      notify(`Error saving group.`, 'error');
      return;
    }

    let groups = [];

    try {
      groups = JSON.parse(groupsData.data.getCustomFieldGroups);
      if (!Array.isArray(groups)) groups = [];
    } catch (err) {
      await APILogError(err.stack || String(err));
      notify(`Error parsing groups.`, 'error');
      return;
    }

    const index = groups.findIndex((g) => g.id === id);

    const group = {
      id,
      name,
      active,
      rules,
      fields,
    };

    if (index !== -1) {
      groups[index] = group;
    } else {
      groups.push(group);
    }

    const saveData = await APIUpdateCustomFieldGroups(groups, loginPassword);
    if (saveData.status !== 200) {
      notify(`Error saving group.`, 'error');
      return;
    } else {
      notify(`Success saving group.`, 'success');
      navigate(`/admin/settings/custom_fields`);
    }
  };

  const fetchData = async () => {
    const data = await APIGetCustomFieldGroupById(id, loginPassword);
    if (data.status == 200) {
      const parsedData = JSON.parse(data.data.getCustomFieldGroupById);
      setName(parsedData.name);
      setRules(parsedData.rules);
      setFields(parsedData.fields);
      setActive(parsedData.active);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="w-full">
        <TitleBar name={name} setName={setName} triggerSave={triggerSave} />
        <Fields fields={fields} setFields={setFields} />
        <Settings rules={rules} setRules={setRules} active={active} setActive={setActive} />
      </div>
    </>
  );
};

export default CustomFieldsGroupsEditPageContent;
