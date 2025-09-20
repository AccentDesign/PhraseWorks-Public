import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import TitleBar from './CustomFieldsGroupsNew/TitleBar';
import Fields from './CustomFieldsGroupsNew/Fields';
import Settings from './CustomFieldsGroupsNew/Settings';
import { APIConnectorContext } from '../../../Contexts/APIConnectorContext';
import { notify } from '../../../Utils/Notification';
import { APIGetCustomFieldGroups, APIUpdateCustomFieldGroups } from '../../../API/APICustomFields';
import { APILogError } from '../../../API/APISystem';

const CustomFieldsGroupsNewPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [rules, setRules] = useState([{ field: 'post_type', equal: 'is_equal', target: 'post' }]);
  const [active, setActive] = useState(true);
  const [fields, setFields] = useState([
    {
      id: uuidv4(),
      order: 1,
      type: 'text',
      label: 'no-label',
      name: '',
      defaultValue: '',
    },
  ]);

  const triggerSave = async () => {
    if (name === '') {
      notify(`Field group 'Name' required.`, 'error');
      return;
    }
    const id = uuidv4();
    const group = {
      id,
      name,
      active,
      rules,
      fields,
    };

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

    groups.push(group);

    const saveData = await APIUpdateCustomFieldGroups(groups, loginPassword);
    if (saveData.status !== 200) {
      notify(`Error saving group.`, 'error');
      return;
    } else {
      notify(`Success saving group.`, 'success');
      navigate(`/admin/settings/custom_fields`);
    }
  };
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

export default CustomFieldsGroupsNewPageContent;
