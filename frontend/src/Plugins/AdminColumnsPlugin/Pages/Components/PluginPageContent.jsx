import React, { useContext, useEffect, useState } from 'react';
import TitleBar from './TitleBar';
import { APIConnectorContext } from '@/Contexts/APIConnectorContext';
import { APIDeleteAdminColumnsEntries, APIGetAdminColumns } from '../../API/APIAdminColumns';
import ColumnsListView from './ColumnsListView';
import ActionsButton from './ActionsButton';

const PluginPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [dbColumns, setDbColumns] = useState([]);
  const [reloadDbColumns, setReloadDbColumns] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [filter, setFilter] = useState('all');

  const toggleCheckbox = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleAllCheckboxes = () => {
    if (selectedIds.length === dbColumns.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(dbColumns.map((col) => col.id));
    }
  };

  const allSelected = dbColumns.length > 0 && selectedIds.length === dbColumns.length;

  const handleApply = async () => {
    if (bulkAction === 'trash' && selectedIds.length > 0) {
      const data = await APIDeleteAdminColumnsEntries(loginPassword, selectedIds);
      const success = data.status === 200 && data.data?.deleteAdminColumnEntries?.success;
      if (success == true) {
        setReloadDbColumns(true);
        setSelectedIds([]);
      }
    }
  };

  const fetchData = async () => {
    const data = await APIGetAdminColumns();
    if (data.status == 200) {
      setDbColumns(data.data.getAdminColumns);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (reloadDbColumns == true) {
      fetchData();
      setReloadDbColumns(false);
    }
  }, [reloadDbColumns]);

  return (
    <div className="w-full px-4 py-4">
      <TitleBar title="Admin Columns" />
      <div className="panel mt-8">
        <ActionsButton
          bulkAction={bulkAction}
          setBulkAction={setBulkAction}
          handleApply={handleApply}
          filter={filter}
        />
        <ColumnsListView
          selectedIds={selectedIds}
          toggleCheckbox={toggleCheckbox}
          allSelected={allSelected}
          toggleAllCheckboxes={toggleAllCheckboxes}
          dbColumns={dbColumns}
        />
      </div>
    </div>
  );
};

export default PluginPageContent;
