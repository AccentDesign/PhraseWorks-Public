import React, { useContext, useEffect, useState } from 'react';
import TitleBar from './CustomPosts/TitleBar';
import { notify } from '../../../Utils/Notification';
import { APIConnectorContext } from '../../../Contexts/APIConnectorContext';
import {
  APIGetCustomPosts,
  APIUpdateCustomPosts,
  APIUpdateCustomPostStatus,
} from '../../../API/APICustomPosts';
import Filter from './CustomPosts/Filter';
import ActionsButton from './CustomPosts/ActionsButton';
import Posts from './CustomPosts/Posts';
import { APILogError } from '../../../API/APISystem';

const CustomPostsPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [reloadPosts, setReloadPosts] = useState(false);
  const [filter, setFilter] = useState('all');
  const [bulkAction, setBulkAction] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleCheckbox = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleAllCheckboxes = () => {
    if (selectedIds.length === posts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(posts.map((post) => post.id));
    }
  };

  const allSelected = posts.length > 0 && selectedIds.length === posts.length;

  const restorePost = async (id) => {
    const data = await APIUpdateCustomPostStatus(loginPassword, 'active', id);
    if (data.status == 200) {
      if (data.data.updateCustomPostStatus.success) {
        setFilter('all');
        setReloadPosts(true);
      }
    }
  };

  const binPost = async (id) => {
    const data = await APIUpdateCustomPostStatus(loginPassword, 'trash', id);
    if (data.status == 200) {
      if (data.data.updateCustomPostStatus.success) {
        setFilter('trash');
        setReloadPosts(true);
      }
    }
  };

  const permanentlyDeletePost = async (id) => {
    const postsData = await APIGetCustomPosts(loginPassword);
    if (postsData.status !== 200) {
      notify(`Error fetching custom posts.`, 'error');
      return;
    }

    let postsD = [];
    try {
      postsD = JSON.parse(postsData.data.getCustomPosts);
      if (!Array.isArray(postsD)) postsD = [];
    } catch (err) {
      await APILogError(err.stack || String(err));
      notify(`Error parsing custom posts.`, 'error');
      return;
    }

    // Remove the post by ID
    const filteredPosts = postsD.filter((p) => p.id !== id);

    const saveData = await APIUpdateCustomPosts(filteredPosts, loginPassword);
    if (saveData.status !== 200) {
      notify(`Error removing custom post.`, 'error');
      return;
    } else {
      notify(`Successfully removed custom post.`, 'success');
      setFilter('all');
      setReloadPosts(true);
    }
  };

  const handleApply = async () => {
    if (bulkAction === 'trash' && selectedIds.length > 0) {
      const deleteResults = await Promise.all(
        selectedIds.map(async (id) => {
          const data = await APIUpdateCustomPostStatus(loginPassword, 'trash', id);
          return data.status === 200 && data.data?.updateCustomPostStatus?.success;
        }),
      );
      if (deleteResults.some((success) => success)) {
        setFilter('trash');
        setReloadPosts(true);
        setSelectedIds([]);
      }
    } else if (bulkAction === 'restore' && selectedIds.length > 0) {
      const deleteResults = await Promise.all(
        selectedIds.map(async (id) => {
          const data = await APIUpdateCustomPostStatus(loginPassword, 'active', id);
          return data.status === 200 && data.data?.updateCustomPostStatus?.success;
        }),
      );
      if (deleteResults.some((success) => success)) {
        setFilter('all');
        setReloadPosts(true);
        setSelectedIds([]);
      }
    } else if (bulkAction === 'delete' && selectedIds.length > 0) {
      const postsData = await APIGetCustomPosts(loginPassword);
      if (postsData.status !== 200) {
        notify(`Error fetching custom posts.`, 'error');
        return;
      }

      let postsD = [];
      try {
        postsD = JSON.parse(postsData.data.getCustomPosts);
        if (!Array.isArray(postsD)) postsD = [];
      } catch (err) {
        await APILogError(err.stack || String(err));
        notify(`Error parsing custom posts.`, 'error');
        return;
      }

      // Remove all selected posts by ID
      const filteredPosts = postsD.filter((p) => !selectedIds.includes(p.id));

      const saveData = await APIUpdateCustomPosts(filteredPosts, loginPassword);
      if (saveData.status !== 200) {
        notify(`Error deleting custom posts.`, 'error');
      } else {
        notify(`Successfully deleted selected posts.`, 'success');
        setFilter('all');
        setReloadPosts(true);
        setSelectedIds([]);
      }
    }
  };

  const fetchData = async () => {
    const postsData = await APIGetCustomPosts(loginPassword);
    if (postsData.status !== 200) {
      notify(`Error saving post.`, 'error');
      return;
    }

    try {
      let postsParsed = JSON.parse(postsData.data.getCustomPosts);
      let postsFiltered = [];
      if (filter == 'all') {
        postsFiltered = postsParsed.filter((item) => item.status != 'trash');
      } else if (filter == 'trash') {
        postsFiltered = postsParsed.filter((item) => item.status == 'trash');
      }
      setPosts(postsFiltered);
      setAllPosts(postsParsed);
      setTotalPosts(postsParsed.filter((item) => item.status != 'trash').length);
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
    if (reloadPosts) {
      setReloadPosts(false);
      fetchData();
    }
  }, [reloadPosts]);

  return (
    <div className="w-full">
      <TitleBar />
      <Filter posts={allPosts} totalPosts={totalPosts} filter={filter} setFilter={setFilter} />
      <ActionsButton
        bulkAction={bulkAction}
        setBulkAction={setBulkAction}
        handleApply={handleApply}
        filter={filter}
      />
      <div className="panel mt-8">
        <Posts
          posts={posts}
          setPosts={setPosts}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          toggleCheckbox={toggleCheckbox}
          restorePost={restorePost}
          binPost={binPost}
          permanentlyDeletePost={permanentlyDeletePost}
          allSelected={allSelected}
          toggleAllCheckboxes={toggleAllCheckboxes}
        />
      </div>
    </div>
  );
};

export default CustomPostsPageContent;
