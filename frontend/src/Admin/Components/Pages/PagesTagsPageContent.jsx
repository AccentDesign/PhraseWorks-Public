import React, { useContext, useEffect, useState } from 'react';
import TitleBar from './Tags/TitleBar';
import AddTagPanel from './Tags/AddTagPanel';
import EditTagPanel from './Tags/EditTagPanel';
import { APIDeletePostTag, APIGetTags } from '../../../API/APIPosts';
import { APIConnectorContext } from '../../../Contexts/APIConnectorContext';
import ListView from './Tags/ListView';
import ActionsButton from './Tags/ActionsButton';
import { notify } from '../../../Utils/Notification';

const PostsTagsPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [tags, setTags] = useState([]);
  const [addTagSliderOpen, setAddTagSliderOpen] = useState(false);
  const [editTagSliderOpen, setEditTagSliderOpen] = useState(false);
  const [tagToEdit, setTagToEdit] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [reloadTags, setReloadTags] = useState(false);
  const [bulkAction, setBulkAction] = useState('');

  const HandleClose = () => {};

  const toggleCheckbox = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleAllCheckboxes = () => {
    if (selectedIds.length === tags.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(tags.map((term) => term.term_id));
    }
  };

  const handleApply = async () => {
    if (bulkAction === 'delete' && selectedIds.length > 0) {
      const deleteResults = await Promise.all(
        selectedIds.map(async (id) => {
          const data = await APIDeletePostTag(loginPassword, id);
          return data.status === 200 && data.data?.deletePostTag?.success;
        }),
      );
      if (deleteResults.some((success) => success)) {
        notify('Successfully deleted tags.', 'success');
        setReloadTags(true);
        setSelectedIds([]);
      }
    }
  };

  const fetchData = async () => {
    const tagsData = await APIGetTags(loginPassword, 'post_tag');
    if (tagsData.status == 200) {
      setTags(tagsData.data.getTags.tags);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (reloadTags) {
      setReloadTags(false);
      fetchData();
    }
  }, [reloadTags]);

  return (
    <div className="w-full">
      <TitleBar setAddTagSliderOpen={setAddTagSliderOpen} />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full mt-8 py-4 px-4">
        <ActionsButton
          bulkAction={bulkAction}
          setBulkAction={setBulkAction}
          handleApply={handleApply}
        />
        <ListView
          tags={tags}
          selectedIds={selectedIds}
          toggleCheckbox={toggleCheckbox}
          toggleAllCheckboxes={toggleAllCheckboxes}
          setTagToEdit={setTagToEdit}
          setEditTagSliderOpen={setEditTagSliderOpen}
        />
      </div>
      <AddTagPanel
        addTagSliderOpen={addTagSliderOpen}
        setAddTagSliderOpen={setAddTagSliderOpen}
        HandleClose={HandleClose}
        setReloadTags={setReloadTags}
      />
      <EditTagPanel
        editTagSliderOpen={editTagSliderOpen}
        setEditTagSliderOpen={setEditTagSliderOpen}
        HandleClose={HandleClose}
        tagToEdit={tagToEdit}
        setTagToEdit={setTagToEdit}
        setReloadTags={setReloadTags}
      />
    </div>
  );
};

export default PostsTagsPageContent;
