import React, { useEffect, useState } from 'react';

const Password = ({
  password,
  setPassword,
  setShowPassword,
  hide,
  setHide,
  getPasswordStrength,
}) => {
  const [strength, setStrength] = useState(0);
  useEffect(() => {
    setStrength(getPasswordStrength(password));
  }, [password]);

  return (
    <>
      <div className="w-full flex flex-row items-center">
        <input
          type={hide ? 'password' : 'text'}
          name="password"
          id="password"
          placeholder="Password"
          autoComplete="Current Password"
          value={password}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
          required=""
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button
          type="button"
          className="ml-4 secondary-btn"
          onClick={() => setHide((prev) => !prev)}
        >
          {hide ? 'Show' : 'Hide'}
        </button>
        <button type="button" className="ml-4 secondary-btn" onClick={() => setShowPassword(false)}>
          Cancel
        </button>
      </div>
      <div className={`mt-1 ${strength.bg} px-4 py-2`}>
        <div className="w-full bg-gray-200 rounded h-2">
          <div
            className={`h-2 rounded ${strength.color} ${strength.width}`}
            style={{ transition: 'width 0.3s ease' }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-1">{strength.label}</p>
      </div>
    </>
  );
};

export default Password;
