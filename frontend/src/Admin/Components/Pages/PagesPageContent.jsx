import React, { useContext, useEffect, useState } from 'react';
import TitleBar from './Dashboard/TitleBar';
import Filter from './Dashboard/Filter';
import {
  APIGetPosts,
  APIAllGetPosts,
  APIGetPostsByAuthor,
  APIGetPostsByStatus,
  APIUpdatePostStatus,
} from '../../../API/APIPosts';
import { APIConnectorContext } from '../../../Contexts/APIConnectorContext';
import { UserContext } from '../../../Contexts/UserContext';
import ActionsButton from './Dashboard/ActionsButton';
import ListView from './Dashboard/ListView';
import Pagination from './Dashboard/Pagination';

const PagesPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const { user } = useContext(UserContext);
  const [pages, setPages] = useState([]);
  const [allPages, setAllPages] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [reloadPages, setReloadPages] = useState(false);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [bulkAction, setBulkAction] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleCheckbox = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleAllCheckboxes = () => {
    if (selectedIds.length === pages.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pages.map((post) => post.id));
    }
  };

  const allSelected = pages.length > 0 && selectedIds.length === pages.length;

  const handleApply = async () => {
    if (bulkAction === 'trash' && selectedIds.length > 0) {
      const deleteResults = await Promise.all(
        selectedIds.map(async (id) => {
          const data = await APIUpdatePostStatus(loginPassword, 'trash', id);
          return data.status === 200 && data.data?.updatePostStatus?.success;
        }),
      );

      if (deleteResults.some((success) => success)) {
        setReloadPages(true);
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
        setReloadPages(true);
        setSelectedIds([]);
      }
    }
  };

  const restorePage = async (id) => {
    const data = await APIUpdatePostStatus(loginPassword, 'draft', id);
    if (data.status == 200) {
      if (data.data.updatePostStatus.success) {
        setReloadPages(true);
      }
    }
  };

  const binPage = async (id) => {
    const data = await APIUpdatePostStatus(loginPassword, 'trash', id);
    if (data.status == 200) {
      if (data.data.updatePostStatus.success) {
        setReloadPages(true);
      }
    }
  };
  const publishPage = async (id) => {
    const data = await APIUpdatePostStatus(loginPassword, 'publish', id);
    if (data.status == 200) {
      if (data.data.updatePostStatus.success) {
        setReloadPages(true);
      }
    }
  };
  const draftPage = async (id) => {
    const data = await APIUpdatePostStatus(loginPassword, 'draft', id);
    if (data.status == 200) {
      if (data.data.updatePostStatus.success) {
        setReloadPages(true);
      }
    }
  };

  const fetchData = async () => {
    if (filter == 'all') {
      const data = await APIGetPosts(loginPassword, page, perPage, 'page');
      if (data.status == 200) {
        setPages(data.data.getPosts.posts);
        setTotalPages(data.data.getPosts.total);
      }
    } else if (filter == 'mine') {
      const data = await APIGetPostsByAuthor(loginPassword, page, perPage, 'page', user.id);
      if (data.status == 200) {
        setPages(data.data.getPostsByAuthor.posts);
        setTotalPages(data.data.getPostsByAuthor.total);
      }
    } else {
      const data = await APIGetPostsByStatus(loginPassword, page, perPage, 'page', filter);
      if (data.status == 200) {
        setPages(data.data.getPostsByStatus.posts);
        setTotalPages(data.data.getPostsByStatus.total);
      }
    }
    const allData = await APIAllGetPosts(loginPassword, 1, 2147483647, 'page');
    if (allData.status == 200) {
      setAllPages(allData.data.getPosts.posts);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, filter]);

  useEffect(() => {
    if (reloadPages) {
      setReloadPages(false);
      if (filter != 'all') {
        setFilter('all');
      } else {
        fetchData();
      }
    }
  }, [reloadPages]);
  return (
    <>
      <div className="w-full">
        <TitleBar />
        <Filter
          pages={allPages}
          totalPages={totalPages}
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

        <div className="panel mt-8mt-8">
          <ListView
            pages={pages}
            selectedIds={selectedIds}
            toggleCheckbox={toggleCheckbox}
            restorePage={restorePage}
            binPage={binPage}
            publishPage={publishPage}
            draftPage={draftPage}
            allSelected={allSelected}
            toggleAllCheckboxes={toggleAllCheckboxes}
          />
          <Pagination totalPages={totalPages} page={page} perPage={perPage} setPage={setPage} />
        </div>
      </div>
    </>
  );
};

export default PagesPageContent;
