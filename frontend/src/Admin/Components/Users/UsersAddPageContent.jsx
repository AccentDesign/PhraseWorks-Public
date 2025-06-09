import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { get_user_by, generatePassword, getPasswordStrength } from '../../../Utils/Users';
import { APIConnectorContext } from '../../../Contexts/APIConnectorContext';
import { APICreateUser, APIGetUserRoles, APIUpdateUser } from '../../../API/APIUsers';
import { notify } from '../../../Utils/Notification';
import TitleBar from './Add/TitleBar';
import Field from './Add/Field';
import Role from './Add/Role';
import Password from './Add/Password';

const UsersAddPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const navigateTo = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [niceName, setNiceName] = useState('');
  const [email, setEmail] = useState('');
  const [userRole, setUserRole] = useState(0);
  const [roles, setRoles] = useState([]);
  const [password, setPassword] = useState(generatePassword());
  const [hide, setHide] = useState(false);

  const addUser = async () => {
    if (getPasswordStrength(password).label == 'Weak') {
      notify('Cannot save a weak password, please amend and try again.', 'error');
      return;
    }
    const data = await APICreateUser(niceName, firstName, lastName, email, password, userRole);
    if (data.status == 200) {
      notify('Successfully added user.', 'success');
      navigateTo('/admin/users');
      return;
    }

    notify('Failed to add user.', 'error');
  };

  const fetchData = async () => {
    const roleData = await APIGetUserRoles(loginPassword);
    if (roleData.status == 200) {
      setRoles(roleData.data.getUserRoles.roles);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full flex flex-col md:flex-row">
      <div className="w-full">
        <TitleBar />

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white w-full mt-8 p-4">
          <Field
            type="text"
            name="nicename"
            title="Nice Name"
            value={niceName}
            updateFunction={setNiceName}
          />
          <Field
            type="text"
            name="first_name"
            title="First Name"
            value={firstName}
            updateFunction={setFirstName}
          />

          <Field
            type="text"
            name="last_name"
            title="Last Name"
            value={lastName}
            updateFunction={setLastName}
          />
          <Role
            name="role"
            title="Role"
            value={userRole}
            updateFunction={setUserRole}
            options={roles}
          />
          <h1 className="text-xl mb-4">Contact Info</h1>
          <Field type="email" name="email" title="Email" value={email} updateFunction={setEmail} />
          <h1 className="text-xl mb-4">Account Management</h1>
          <div className="w-full my-4">
            <label>New Password</label>
            <Password
              password={password}
              setPassword={setPassword}
              hide={hide}
              setHide={setHide}
              getPasswordStrength={getPasswordStrength}
            />
          </div>
          <button
            type="button"
            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
            onClick={() => {
              addUser();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 mr-2"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                clipRule="evenodd"
              />
            </svg>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersAddPageContent;
