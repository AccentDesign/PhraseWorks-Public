import React, { useContext, useEffect, useState } from 'react';
import TitleBar from '../Users/Dashboard/TitleBar';
import Filter from './Dashboard/Filter';
import { APIConnectorContext } from '../../../Contexts/APIConnectorContext.jsx';
import { APIAllGetUsers } from '../../../API/APIUsers.js';
import ListView from './Dashboard/ListView.jsx';
import Pagination from './Dashboard/Pagination.jsx';

const UsersPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleCheckbox = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleAllCheckboxes = () => {
    if (selectedIds.length === users.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(users.map((post) => post.id));
    }
  };

  const allSelected = users.length > 0 && selectedIds.length === users.length;

  const fetchData = async () => {
    const data = await APIAllGetUsers(loginPassword, page, perPage);
    if (data.status == 200) {
      setUsers(data.data.getUsers.users);
      setTotalUsers(data.data.getUsers.total);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="w-full">
        <TitleBar />
        <Filter
          users={users}
          filter={filter}
          setFilter={setFilter}
          totalUsers={totalUsers}
          loginPassword={loginPassword}
        />

        <div className="panel mt-8">
          <ListView
            users={users}
            filter={filter}
            selectedIds={selectedIds}
            toggleCheckbox={toggleCheckbox}
            allSelected={allSelected}
            toggleAllCheckboxes={toggleAllCheckboxes}
          />
          <Pagination totalUsers={totalUsers} page={page} perPage={perPage} setPage={setPage} />
        </div>
      </div>
    </>
  );
};

export default UsersPageContent;
