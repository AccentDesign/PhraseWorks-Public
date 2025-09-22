import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  APIGetGForm,
  APIUpdateGForm,
  APIGetEntries,
  APIDeleteEntriesGForm,
} from '../../API/APIForms';
import { APIConnectorContext } from '@/Contexts/APIConnectorContext';
import { notify } from '@/Utils/Notification';
import PageHeader from './Forms/PageHeader';
import BulkActions from './Entries/BulkActions';
import Filter from './Entries/Filter';
import ListView from './Entries/ListView';
import Pagination from './Entries/Pagination';

const FormEntriesPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const { id } = useParams();
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [form, setForm] = useState(null);
  const [formItems, setFormItems] = useState([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [entries, setEntries] = useState([]);
  const [reloadEntries, setReloadEntries] = useState(false);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [bulkAction, setBulkAction] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleCheckbox = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleAllCheckboxes = () => {
    if (selectedIds.length === entries.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(entries.map((entry) => entry.id));
    }
  };

  const allSelected = entries.length > 0 && selectedIds.length === entries.length;

  const handleApply = async () => {
    if (bulkAction === 'trash' && selectedIds.length > 0) {
      const deleteResults = await APIDeleteEntriesGForm(loginPassword, selectedIds);
      if (deleteResults.data.deleteEntriesGForm.success == true) {
        setReloadEntries(true);
        setSelectedIds([]);
      }
    }
  };

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
        setForm(data.data.getGForm);
        setFormTitle(data.data.getGForm.title);
        setFormDescription(data.data.getGForm.description);
        setFormItems(data.data.getGForm.fields.fields);
      }
    }

    const entriesData = await APIGetEntries(loginPassword, page, perPage, id);
    if (entriesData.status == 200) {
      if (entriesData.data.getEntriesGform.entries) {
        setEntries(entriesData.data.getEntriesGform.entries);
        setTotalEntries(entriesData.data.getEntriesGform.total);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  useEffect(() => {
    if (reloadEntries == true) {
      setReloadEntries(false);
      fetchData();
    }
  }, [reloadEntries]);

  return (
    <div className="flex flex-col h-screen">
      <PageHeader
        formTitle={formTitle}
        setFormTitle={setFormTitle}
        saveForm={saveForm}
        formId={id}
      />
      <div className="px-4">
        <Filter filter={filter} setFilter={setFilter} totalEntries={totalEntries} />
        <BulkActions
          bulkAction={bulkAction}
          setBulkAction={setBulkAction}
          handleApply={handleApply}
          filter={filter}
        />
        <ListView
          entries={entries}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          allSelected={allSelected}
          form={form}
          toggleCheckbox={toggleCheckbox}
          toggleAllCheckboxes={toggleAllCheckboxes}
        />

        <Pagination totalEntries={totalEntries} page={page} perPage={perPage} setPage={setPage} />
      </div>
    </div>
  );
};

export default FormEntriesPageContent;
