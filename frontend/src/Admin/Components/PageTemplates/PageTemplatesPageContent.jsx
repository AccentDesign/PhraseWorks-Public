import React, { useContext, useEffect, useState } from 'react';
import TitleBar from './Dashboard/TitleBar';
import { APIAllGetPageTemplate, APIGetPageTemplates } from '../../../API/APIPageTemplates';
import { APIConnectorContext } from '../../../Contexts/APIConnectorContext';
import ListView from './Dashboard/ListView';
import Pagination from './Dashboard/Pagination';
import AddPanel from './Dashboard/AddPanel';
import EditPanel from './Dashboard/EditPanel';

const PageTemplatesPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);

  const [pageTemplates, setPageTemplates] = useState([]);
  const [allPages, setAllPages] = useState([]);
  const [totalPageTemplates, setTotalPageTemplates] = useState(0);
  const [reloadPageTemplates, setReloadPageTemplates] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [selectedIds, setSelectedIds] = useState([]);
  const [addSliderOpen, setAddSliderOpen] = useState(false);
  const [editSliderOpen, setEditSliderOpen] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState(null);

  const HandleClose = () => {};

  const toggleCheckbox = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleAllCheckboxes = () => {
    if (selectedIds.length === pageTemplates.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pageTemplates.map((post) => post.id));
    }
  };

  const allSelected = pageTemplates.length > 0 && selectedIds.length === pageTemplates.length;

  const fetchData = async () => {
    const data = await APIGetPageTemplates(loginPassword, page, perPage, 'page');
    if (data.status == 200) {
      setPageTemplates(data.data.getPageTemplates.templates);
      setTotalPageTemplates(data.data.getPageTemplates.total);
    }
    const allData = await APIAllGetPageTemplate(loginPassword);
    if (allData.status == 200) {
      setAllPages(allData.data.getPageTemplatesAll.templates);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  useEffect(() => {
    if (reloadPageTemplates) {
      setReloadPageTemplates(false);
      fetchData();
    }
  }, [reloadPageTemplates]);

  return (
    <>
      <div className="w-full">
        <TitleBar setAddSliderOpen={setAddSliderOpen} />

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full mt-8">
          <ListView
            pageTemplates={pageTemplates}
            selectedIds={selectedIds}
            toggleCheckbox={toggleCheckbox}
            allSelected={allSelected}
            toggleAllCheckboxes={toggleAllCheckboxes}
            setTemplateToEdit={setTemplateToEdit}
            setEditSliderOpen={setEditSliderOpen}
          />
          <Pagination
            totalPages={totalPageTemplates}
            page={page}
            perPage={perPage}
            setPage={setPage}
          />
        </div>
      </div>
      <AddPanel
        addSliderOpen={addSliderOpen}
        setAddSliderOpen={setAddSliderOpen}
        HandleClose={HandleClose}
        setReloadPageTemplates={setReloadPageTemplates}
      />
      <EditPanel
        editSliderOpen={editSliderOpen}
        setEditSliderOpen={setEditSliderOpen}
        HandleClose={HandleClose}
        templateToEdit={templateToEdit}
        setTemplateToEdit={setTemplateToEdit}
        setReloadPageTemplates={setReloadPageTemplates}
      />
    </>
  );
};

export default PageTemplatesPageContent;
