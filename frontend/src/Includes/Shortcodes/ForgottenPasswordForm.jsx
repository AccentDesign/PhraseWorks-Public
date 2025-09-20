import React from 'react';

const ForgottenPasswordForm = ({
  email,
  setEmail,
  email2,
  setEmail2,
  ForgottenPasswordSubmit,
  errors,
  setErrors,
  calculateForgottenPasswordErrors,
}) => {
  const getError = (fieldName) => {
    const errorObj = errors.find((err) => err.field === fieldName);
    return errorObj ? errorObj.error : null;
  };

  const handleChange = (field, value) => {
    const newValues = { email, email2, [field]: value };
    calculateForgottenPasswordErrors(newValues);

    if (field === 'email') setEmail(value);
    if (field === 'email2') setEmail2(value);
  };

  return (
    <>
      <div className="text-center">
        <h1 className="text-gray-900 text-3xl mt-4 font-medium">Forgotten Password</h1>
        <p className="text-gray-500 text-sm mt-2">Please fill in to continue</p>
      </div>
      <div className="space-y-4 md:space-y-4 mt-4">
        <div>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            autoComplete="Email"
            value={email}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
            required=""
            onChange={(e) => {
              const value = e.target.value;
              handleChange('email', value);
            }}
          />
          {getError('email') && (
            <div className="p-4 mt-2 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
              <span className="font-medium">Error! </span>
              {getError('email')}
            </div>
          )}
        </div>
        <div>
          <input
            type="email"
            name="confirmEmail"
            id="confirmEmail"
            placeholder="Confirm Email"
            autoComplete="Confirm Email"
            value={email2}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
            required=""
            onChange={(e) => {
              const value = e.target.value;
              handleChange('email2', value);
            }}
          />
          {getError('confirmEmail') && (
            <div className="p-4 mt-2 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
              <span className="font-medium">Error! </span>
              {getError('confirmEmail')}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full cursor-pointer text-white bg-menu-accent hover:bg-menu-primary rounded-full focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-5 py-2.5 text-center"
          onClick={(e) => ForgottenPasswordSubmit(e)}
        >
          Submit
        </button>
      </div>
    </>
  );
};

export default ForgottenPasswordForm;
