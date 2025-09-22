import React, { useEffect, useContext, useState } from 'react';
import TitleBar from './TitleBar';
import {
  APIDeleteGForm,
  APIGetFormViews,
  APIGetGForms,
  APIGetTotalEntries,
  APIUpdateGFormActive,
} from '../../API/APIForms';
import { APIConnectorContext } from '../../../../Contexts/APIConnectorContext';
import { notify } from '../../../../Utils/Notification';
import ListView from './Forms/ListView';
import Pagination from './Forms/Pagination';

const PluginPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [forms, setForms] = useState([]);
  const [allForms, setAllForms] = useState([]);
  const [totalForms, setTotalForms] = useState(0);
  const [reloadForms, setReloadForms] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [bulkAction, setBulkAction] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleCheckbox = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleAllCheckboxes = () => {
    if (selectedIds.length === forms.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(forms.map((form) => form.id));
    }
  };

  const allSelected = forms.length > 0 && selectedIds.length === forms.length;

  const updateFormActive = async (id, active) => {
    const data = await APIUpdateGFormActive(loginPassword, id, active);
    if (data.status == 200) {
      if (data.data.updateGFormActive.success == true) {
        await fetchData();
      }
    }
  };

  const confirmDelete = async (id) => {
    const deleteData = await APIDeleteGForm(loginPassword, id);
    if (deleteData.status === 200 && deleteData.data.deleteGForm.success === true) {
      notify('Form deleted successfully.', 'success');
      fetchData();
      setConfirmDeleteId(null);
    } else {
      notify('Failed to delete form.', 'error');
    }
  };

  const onDeleteClick = (id) => {
    setConfirmDeleteId(id);
  };

  const onCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const onConfirmDelete = () => {
    if (confirmDeleteId !== null) {
      confirmDelete(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  const fetchData = async () => {
    const data = await APIGetGForms(loginPassword);
    if (data.status == 200) {
      const tmpForms = data.data.getGForms.forms;

      setForms(tmpForms);
      setTotalForms(data.data.getGForms.total);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full px-4 py-4">
      <TitleBar title="ZeroG Forms" />
      <div className="panel mt-8">
        <ListView
          forms={forms}
          selectedIds={selectedIds}
          toggleCheckbox={toggleCheckbox}
          binForm={onDeleteClick}
          allSelected={allSelected}
          toggleAllCheckboxes={toggleAllCheckboxes}
          updateFormActive={updateFormActive}
        />
        <Pagination totalForms={totalForms} page={page} perPage={perPage} setPage={setPage} />
      </div>
      {confirmDeleteId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
              <h3 className="text-xl font-semibold text-gray-900">Confirm Delete</h3>
              <button
                type="button"
                onClick={onCancelDelete}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                data-modal-hide="default-modal"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-4 md:p-5 space-y-4">
              <p className="text-base leading-relaxed text-gray-500">
                Are you sure you want to delete this form and all of its data?
              </p>
            </div>
            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b">
              <button
                data-modal-hide="default-modal"
                type="button"
                className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                onClick={onConfirmDelete}
              >
                Delete
              </button>
              <button
                data-modal-hide="default-modal"
                type="button"
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
                onClick={onCancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PluginPageContent;
