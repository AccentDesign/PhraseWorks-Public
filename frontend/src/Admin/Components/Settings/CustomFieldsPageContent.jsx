import React, { useContext, useEffect, useState } from 'react';
import TitleBar from './CustomFields/TitleBar';
import Groups from './CustomFields/Groups';
import Filter from './CustomFields/Filter';
import { APIConnectorContext } from '../../../Contexts/APIConnectorContext';
import { notify } from '../../../Utils/Notification';
import {
  APIGetCustomFieldGroups,
  APIUpdateCustomFieldsGroupStatus,
} from '../../../API/APICustomFields';
import ActionsButton from './CustomFields/ActionsButton';
import { APILogError } from '../../../API/APISystem';

const CustomFieldsPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [groups, setGroups] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [totalGroups, setTotalGroups] = useState(0);
  const [reloadGroups, setReloadGroups] = useState(false);
  const [filter, setFilter] = useState('all');
  const [bulkAction, setBulkAction] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleCheckbox = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleAllCheckboxes = () => {
    if (selectedIds.length === groups.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(groups.map((post) => post.id));
    }
  };

  const allSelected = groups.length > 0 && selectedIds.length === groups.length;

  const restoreGroup = async (id) => {
    const data = await APIUpdateCustomFieldsGroupStatus(loginPassword, 'active', id);
    if (data.status == 200) {
      if (data.data.updateCustomFieldGroupsStatus.success) {
        setReloadGroups(true);
      }
    }
  };

  const binGroup = async (id) => {
    const data = await APIUpdateCustomFieldsGroupStatus(loginPassword, 'trash', id);
    if (data.status == 200) {
      if (data.data.updateCustomFieldGroupsStatus.success) {
        setReloadGroups(true);
      }
    }
  };

  const handleApply = async () => {
    if (bulkAction === 'trash' && selectedIds.length > 0) {
      const deleteResults = await Promise.all(
        selectedIds.map(async (id) => {
          const data = await APIUpdateCustomFieldsGroupStatus(loginPassword, 'trash', id);
          return data.status === 200 && data.data?.updateCustomFieldGroupsStatus?.success;
        }),
      );
      if (deleteResults.some((success) => success)) {
        setReloadGroups(true);
        setSelectedIds([]);
      }
    } else if (bulkAction === 'restore' && selectedIds.length > 0) {
      const deleteResults = await Promise.all(
        selectedIds.map(async (id) => {
          const data = await APIUpdateCustomFieldsGroupStatus(loginPassword, 'active', id);
          return data.status === 200 && data.data?.updateCustomFieldGroupsStatus?.success;
        }),
      );

      if (deleteResults.some((success) => success)) {
        setReloadGroups(true);
        setSelectedIds([]);
      }
    }
  };

  const fetchData = async () => {
    const groupsData = await APIGetCustomFieldGroups(loginPassword);
    if (groupsData.status !== 200) {
      notify(`Error saving group.`, 'error');
      return;
    }

    try {
      let groupsParsed = JSON.parse(groupsData.data.getCustomFieldGroups);
      let groupsFiltered = [];
      if (filter == 'all') {
        groupsFiltered = groupsParsed.filter((item) => item.status != 'trash');
      } else if (filter == 'trash') {
        groupsFiltered = groupsParsed.filter((item) => item.status == 'trash');
      }
      setGroups(groupsFiltered);
      setAllGroups(groupsParsed);
      setTotalGroups(groupsParsed.filter((item) => item.status != 'trash').length);
    } catch (err) {
      await APILogError(err.stack || String(err));
      notify(`Error parsing groups.`, 'error');
      return;
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  useEffect(() => {
    if (reloadGroups) {
      setReloadGroups(false);
      fetchData();
    }
  }, [reloadGroups]);

  return (
    <>
      <div className="w-full">
        <TitleBar />
        <Filter
          groups={allGroups}
          totalGroups={totalGroups}
          filter={filter}
          setFilter={setFilter}
        />
        <ActionsButton
          bulkAction={bulkAction}
          setBulkAction={setBulkAction}
          handleApply={handleApply}
          filter={filter}
        />
        <div className="panel mt-8">
          <Groups
            groups={groups}
            setGroups={setGroups}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            toggleCheckbox={toggleCheckbox}
            restoreGroup={restoreGroup}
            binGroup={binGroup}
            allSelected={allSelected}
            toggleAllCheckboxes={toggleAllCheckboxes}
          />
        </div>
      </div>
    </>
  );
};

export default CustomFieldsPageContent;
