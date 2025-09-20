import React, { useContext, useEffect, useState } from 'react';
import TitleBar from './Comments/TitleBar';
import { UserContext } from '../../Contexts/UserContext';
import { APIConnectorContext } from '../../Contexts/APIConnectorContext';
import Pagination from './Comments/Pagination';
import Filter from './Comments/Filter';
import ActionsButton from './Comments/ActionsButton';
import ListView from './Comments/ListView';
import {
  APIDeleteCommentById,
  APIGetAdminComments,
  APIGetCommentsByAuthor,
} from '../../API/APIComments';
import { notify } from '../../Utils/Notification';

const CommentsPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const { user } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [reloadComments, setReloadComments] = useState(false);

  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [bulkAction, setBulkAction] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleCheckbox = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleAllCheckboxes = () => {
    if (selectedIds.length === comments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(comments.map((comment) => comment.id));
    }
  };

  const allSelected = comments.length > 0 && selectedIds.length === comments.length;

  const handleApply = async () => {
    if (bulkAction === 'trash' && selectedIds.length > 0) {
      const deleteResults = await Promise.all(
        selectedIds.map(async (id) => {
          const data = await APIDeleteCommentById(loginPassword, id);
          return data.status === 200 && data.data?.deleteCommentById?.success;
        }),
      );
      if (deleteResults.some((success) => success)) {
        notify('Successfully deleted comment(s)', 'success');
        setReloadComments(true);
        setSelectedIds([]);
      }
    }
  };

  const permanentDelete = async (id) => {
    const data = await APIDeleteCommentById(loginPassword, id);
    if (data.status == 200) {
      if (data.data.deleteCommentById.success) {
        setReloadComments(true);
        notify('Successfully deleted comment', 'success');
      }
    }
  };

  const fetchData = async (isMounted = true) => {
    const allCommentsData = await APIGetAdminComments(loginPassword, 1, 999999999);
    if (isMounted) setAllComments(allCommentsData.data.getAllAdminComments.comments);
    const allData = await APIGetAdminComments(loginPassword, page, perPage);
    const mineData = await APIGetCommentsByAuthor(loginPassword, page, perPage, user.id);
    if (filter == 'all') {
      if (isMounted && allData.status == 200) {
        setComments(allData.data.getAllAdminComments.comments);
        setTotalComments(allData.data.getAllAdminComments.totalComments);
      }
    } else if (filter == 'mine') {
      if (isMounted && mineData.status == 200) {
        setComments(mineData.data.getAllAdminCommentsByAuthor.comments);
        setTotalComments(mineData.data.getAllAdminCommentsByAuthor.totalComments);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      await fetchData(isMounted);
    };
    load();

    return () => {
      isMounted = false;
    };
  }, [page, filter]);

  useEffect(() => {
    let isMounted = true;

    if (reloadComments) {
      setReloadComments(false);
      if (filter != 'all') {
        setFilter('all');
      } else {
        fetchData(isMounted);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [reloadComments]);

  return (
    <div className="w-full">
      <TitleBar />
      <Filter
        comments={allComments}
        totalComments={totalComments}
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
          comments={comments}
          selectedIds={selectedIds}
          toggleCheckbox={toggleCheckbox}
          permanentDelete={permanentDelete}
          allSelected={allSelected}
          toggleAllCheckboxes={toggleAllCheckboxes}
        />
        <Pagination totalComments={totalComments} page={page} perPage={perPage} setPage={setPage} />
      </div>
    </div>
  );
};

export default CommentsPageContent;
