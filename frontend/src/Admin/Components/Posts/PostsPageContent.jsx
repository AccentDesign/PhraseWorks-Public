import React, { useContext, useEffect, useState } from 'react';
import TitleBar from './Dashboard/TitleBar';
import Filter from './Dashboard/Filter';
import {
  APIGetPosts,
  APIAllGetPosts,
  APIGetPostsByAuthor,
  APIGetPostsByStatus,
  APIUpdatePostStatus,
  APIDeletePost,
  APIGetPostTableFields,
} from '../../../API/APIPosts';
import { APIConnectorContext } from '../../../Contexts/APIConnectorContext';
import { UserContext } from '../../../Contexts/UserContext';
import ActionsButton from './Dashboard/ActionsButton';
import ListView from './Dashboard/ListView';
import Pagination from './Dashboard/Pagination';
import { handleComponentError } from '../../../Utils/ErrorHandler';

const PostsPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [reloadPosts, setReloadPosts] = useState(false);
  const [postTableFields, setPostTableFields] = useState([]);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
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

  const handleApply = async () => {
    if (bulkAction === 'trash' && selectedIds.length > 0) {
      const deleteResults = await Promise.all(
        selectedIds.map(async (id) => {
          const data = await APIUpdatePostStatus(loginPassword, 'trash', id);
          return data.status === 200 && data.data?.updatePostStatus?.success;
        }),
      );

      if (deleteResults.some((success) => success)) {
        setReloadPosts(true);
        setSelectedIds([]);
      }
    } else if (bulkAction === 'restore' && selectedIds.length > 0) {
      const deleteResults = await Promise.all(
        selectedIds.map(async (id) => {
          const data = await APIUpdatePostStatus(loginPassword, 'draft', id);
          return data.status === 200 && data.data?.updatePostStatus?.success;
        }),
      );

      if (deleteResults.some((success) => success)) {
        setReloadPosts(true);
        setSelectedIds([]);
      }
    }
  };

  const restorePost = async (id) => {
    const data = await APIUpdatePostStatus(loginPassword, 'draft', id);
    if (data.status == 200) {
      if (data.data.updatePostStatus.success) {
        setReloadPosts(true);
      }
    }
  };

  const binPost = async (id) => {
    const data = await APIUpdatePostStatus(loginPassword, 'trash', id);
    if (data.status == 200) {
      if (data.data.updatePostStatus.success) {
        setReloadPosts(true);
      }
    }
  };
  const publishPost = async (id) => {
    const data = await APIUpdatePostStatus(loginPassword, 'publish', id);
    if (data.status == 200) {
      if (data.data.updatePostStatus.success) {
        setReloadPosts(true);
      }
    }
  };
  const draftPost = async (id) => {
    const data = await APIUpdatePostStatus(loginPassword, 'draft', id);
    if (data.status == 200) {
      if (data.data.updatePostStatus.success) {
        setReloadPosts(true);
      }
    }
  };
  const permanentDelete = async (id) => {
    const data = await APIDeletePost(loginPassword, id);
    if (data.status == 200) {
      if (data.data.deletePost.success) {
        setReloadPosts(true);
      }
    }
  };

  const fetchData = async () => {
    try {
      if (filter == 'all') {
        const data = await APIGetPosts(loginPassword, page, perPage, 'post');

        if (data.status == 200 && data.data?.getPosts) {
          setPosts(data.data.getPosts.posts || []);
          setTotalPosts(data.data.getPosts.total || 0);
        }
      } else if (filter == 'mine') {
        const data = await APIGetPostsByAuthor(page, perPage, 'post', user.id);
        if (data.status == 200 && data.data?.getPostsByAuthor) {
          setPosts(data.data.getPostsByAuthor.posts || []);
        }
      } else {
        const data = await APIGetPostsByStatus(loginPassword, page, perPage, 'post', filter);
        if (data.status == 200 && data.data?.getPostsByStatus) {
          setPosts(data.data.getPostsByStatus.posts || []);
        }
      }

      const allData = await APIAllGetPosts(loginPassword, 1, 2147483647, 'post');
      if (allData.status == 200 && allData.data?.getPosts) {
        setAllPosts(allData.data.getPosts.posts || []);
      }

      const fieldsData = await APIGetPostTableFields(loginPassword, 'post');
      if (fieldsData.status == 200 && fieldsData.data?.getPostTableFields) {
        setPostTableFields(fieldsData.data.getPostTableFields.fields || []);
      } else {
        console.warn('getPostTableFields data is null or undefined');
        setPostTableFields([]);
      }
    } catch (error) {
      await handleComponentError(error, 'PostsPageContent', 'fetchData', {
        additionalData: { filter, page, perPage, userId: user?.id },
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, filter]);

  useEffect(() => {
    if (reloadPosts) {
      setReloadPosts(false);
      if (filter != 'all') {
        setFilter('all');
      } else {
        fetchData();
      }
    }
  }, [reloadPosts]);

  return (
    <>
      <div className="w-full">
        <TitleBar />
        <Filter
          posts={allPosts}
          totalPosts={totalPosts}
          filter={filter}
          setFilter={setFilter}
          user={user}
        />
        <ActionsButton
          bulkAction={bulkAction}
          setBulkAction={setBulkAction}
          handleApply={handleApply}
          filter={filter}
        />

        <div className="panel mt-8">
          <ListView
            posts={posts}
            selectedIds={selectedIds}
            toggleCheckbox={toggleCheckbox}
            restorePost={restorePost}
            binPost={binPost}
            publishPost={publishPost}
            draftPost={draftPost}
            permanentDelete={permanentDelete}
            allSelected={allSelected}
            toggleAllCheckboxes={toggleAllCheckboxes}
            postTableFields={postTableFields}
          />
          <Pagination totalPosts={totalPosts} page={page} perPage={perPage} setPage={setPage} />
        </div>
      </div>
    </>
  );
};

export default PostsPageContent;
