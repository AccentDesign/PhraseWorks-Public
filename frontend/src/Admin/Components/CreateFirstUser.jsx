import React, { useEffect, useState } from 'react';
import { notify } from '../../Utils/Notification';
import { APICreateSystem } from '../../API/APISystem';

const CreateFirstUser = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');

  const [redirectToHome, setRedirectToHome] = useState(false);

  const CreateUser = async (e) => {
    e.preventDefault();
    if (password != '') {
      const result = await APICreateSystem(email, firstName, lastName, displayName, password);
      console.log(result);
      if (result.data.systemCreate.success == true) {
        setRedirectToHome(true);
      }
    } else {
      notify('Error Occured...', 'error');
    }
  };

  useEffect(() => {
    if (redirectToHome == true) {
      window.location.href = '/';
    }
  }, [redirectToHome]);

  return (
    <>
      <form className="w-[400px] space-y-4 md:space-y-4 mt-4" action="#">
        <div>
          <input
            type="display_name"
            name="display_name"
            id="display_name"
            placeholder="Display Name"
            autoComplete="Display Name"
            value={displayName}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
            required=""
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div>
          <input
            type="first_name"
            name="first_name"
            id="first_name"
            placeholder="First Name"
            autoComplete="First Name"
            value={firstName}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
            required=""
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <input
            type="last_name"
            name="last_name"
            id="last_name"
            placeholder="Last Name"
            autoComplete="Last Name"
            value={lastName}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
            required=""
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            autoComplete="Current Email"
            value={email}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
            required=""
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            autoComplete="Current Password"
            value={password}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
            required=""
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full cursor-pointer text-white bg-mid-teal hover:bg-lighter-teal focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          onClick={(e) => CreateUser(e)}
        >
          Create System
        </button>
      </form>
    </>
  );
};

export default CreateFirstUser;
