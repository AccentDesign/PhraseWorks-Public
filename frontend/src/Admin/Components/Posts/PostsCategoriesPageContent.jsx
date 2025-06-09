import React, { useContext, useEffect, useState } from 'react';
import TitleBar from './Categories/TitleBar';
import AddCategoryPanel from './Categories/AddCategoryPanel';
import EditCategoryPanel from './Categories/EditCategoryPanel';
import { APIDeletePostCategory, APIGetCategories } from '../../../API/APIPosts';
import { APIConnectorContext } from '../../../Contexts/APIConnectorContext';
import ListView from './Categories/ListView';
import ActionsButton from './Categories/ActionsButton';
import { notify } from '../../../Utils/Notification';

const PostsCategoriesPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [categories, setCategories] = useState([]);
  const [addCategorySliderOpen, setAddCategorySliderOpen] = useState(false);
  const [editCategorySliderOpen, setEditCategorySliderOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [reloadCategories, setReloadCategories] = useState(false);
  const [bulkAction, setBulkAction] = useState('');

  const HandleClose = () => {};

  const toggleCheckbox = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleAllCheckboxes = () => {
    if (selectedIds.length === categories.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(categories.map((term) => term.term_id));
    }
  };

  const handleApply = async () => {
    if (bulkAction === 'delete' && selectedIds.length > 0) {
      const deleteResults = await Promise.all(
        selectedIds.map(async (id) => {
          const data = await APIDeletePostCategory(loginPassword, id);
          return data.status === 200 && data.data?.deletePostCategory?.success;
        }),
      );
      if (deleteResults.some((success) => success)) {
        notify('Successfully deleted categories.', 'success');
        setReloadCategories(true);
        setSelectedIds([]);
      }
    }
  };

  const fetchData = async () => {
    const categoriesData = await APIGetCategories(loginPassword, 'category');
    if (categoriesData.status == 200) {
      setCategories(categoriesData.data.getCategories.categories);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (reloadCategories) {
      setReloadCategories(false);
      fetchData();
    }
  }, [reloadCategories]);

  return (
    <div className="w-full">
      <TitleBar setAddCategorySliderOpen={setAddCategorySliderOpen} />
      <div className="panel mt-8 py-4 px-4">
        <ActionsButton
          bulkAction={bulkAction}
          setBulkAction={setBulkAction}
          handleApply={handleApply}
        />
        <ListView
          categories={categories}
          selectedIds={selectedIds}
          toggleCheckbox={toggleCheckbox}
          toggleAllCheckboxes={toggleAllCheckboxes}
          setCategoryToEdit={setCategoryToEdit}
          setEditCategorySliderOpen={setEditCategorySliderOpen}
        />
      </div>
      <AddCategoryPanel
        addCategorySliderOpen={addCategorySliderOpen}
        setAddCategorySliderOpen={setAddCategorySliderOpen}
        HandleClose={HandleClose}
        setReloadCategories={setReloadCategories}
      />
      <EditCategoryPanel
        editCategorySliderOpen={editCategorySliderOpen}
        setEditCategorySliderOpen={setEditCategorySliderOpen}
        HandleClose={HandleClose}
        categoryToEdit={categoryToEdit}
        setCategoryToEdit={setCategoryToEdit}
        setReloadCategories={setReloadCategories}
      />
    </div>
  );
};

export default PostsCategoriesPageContent;
