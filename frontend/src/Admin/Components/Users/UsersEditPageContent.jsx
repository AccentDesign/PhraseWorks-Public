import React, { useContext, useEffect, useState } from 'react';
import { get_user_by, generatePassword, getPasswordStrength } from '../../../Utils/Users';
import { APIConnectorContext } from '../../../Contexts/APIConnectorContext';
import { APIGetUserRoles, APIPasswordResetAdmin, APIUpdateUser } from '../../../API/APIUsers';
import TitleBar from './Edit/TitleBar';
import { notify } from '../../../Utils/Notification';
import Field from './Edit/Field';
import Role from './Edit/Role';
import Password from './Edit/Password';

const UsersEditPageContent = ({ id }) => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [user, setUser] = useState(null);
  const [reloadUser, setReloadUser] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [niceName, setNiceName] = useState('');
  const [email, setEmail] = useState('');
  const [userRole, setUserRole] = useState(0);
  const [roles, setRoles] = useState([]);
  const [password, setPassword] = useState(generatePassword());
  const [showPassword, setShowPassword] = useState(false);
  const [hide, setHide] = useState(false);

  const updateUser = async () => {
    if (showPassword && getPasswordStrength(password).label == 'Weak') {
      notify('Cannot save a weak password, please amend and try again.', 'error');
      return;
    }
    const data = await APIUpdateUser(
      loginPassword,
      niceName,
      firstName,
      lastName,
      email,
      showPassword ? password : null,
      userRole,
      user?.id,
    );
    if (data.status == 200) {
      notify('Successfully updated user.', 'success');
      return;
    }

    notify('Failed to update user.', 'error');
  };

  const sendPasswordReset = async () => {
    const data = await APIPasswordResetAdmin(loginPassword, id);
    if (data.status == 200) {
      if (data.data.passwordResetAdmin.success) {
        notify('Password reset email sent to client', 'success');
      } else {
        notify('Password reset email failed to send to client', 'error');
      }
    } else {
      notify('Password reset email failed to send to client', 'error');
    }
  };

  const fetchUserData = async () => {
    const data = await get_user_by('id', id);
    if (data != null) {
      setUser(data);
      setNiceName(data.user_nicename);
      setFirstName(data.first_name);
      setLastName(data.last_name);
      setEmail(data.user_email);
      setUserRole(data.user_role.id);
    }
    const roleData = await APIGetUserRoles(loginPassword);
    if (roleData.status == 200) {
      setRoles(roleData.data.getUserRoles.roles);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (reloadUser == true) {
      setReloadUser(false);
      fetchUserData();
    }
  }, [reloadUser]);

  return (
    <div className="w-full flex flex-col md:flex-row">
      <div className="w-full">
        <TitleBar user={user} />

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

            {showPassword ? (
              <>
                <Password
                  password={password}
                  setPassword={setPassword}
                  hide={hide}
                  setHide={setHide}
                  setShowPassword={setShowPassword}
                  getPasswordStrength={getPasswordStrength}
                />
              </>
            ) : (
              <button type="button" className="secondary-btn" onClick={() => setShowPassword(true)}>
                Set New Password
              </button>
            )}
          </div>
          <div className="w-full my-4">
            <label>Password Reset</label>
            <button type="button" className="secondary-btn" onClick={() => sendPasswordReset()}>
              Send Reset Link
            </button>
            <p className="text-sm text-gray-500">
              Send {niceName} a link to reset their password. This will not change their password,
              nor will it force a change.
            </p>
          </div>
          <button
            type="button"
            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
            onClick={() => {
              updateUser();
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
                d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
                clipRule="evenodd"
              />
            </svg>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersEditPageContent;
