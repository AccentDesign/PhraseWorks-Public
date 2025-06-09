import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../../Contexts/UserContext';
import { notify } from '../../../Utils/Notification';
import Password from '../Components/Login/Password';
import { generatePassword, getPasswordStrength } from '../../../Utils/Users';
import { APICreateNewPassword } from '../../../API/APIUsers';

const Login = () => {
  document.title = 'Login';
  const { LoginUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [action, setAction] = useState(null);
  const [key, setKey] = useState(null);
  const [login, setLogin] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const redirect = queryParams.get('redirect') || '/';

  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [redirectToHome, setRedirectToHome] = useState(false);

  const LoginSubmit = async (e) => {
    e.preventDefault();
    if (password != '') {
      const result = await LoginUser(email, password);
      if (result == true) {
        setRedirectToHome(true);
      }
    } else {
      notify('Incorrect Password', 'error');
    }
  };

  const submitNewPassword = async () => {
    const data = await APICreateNewPassword(password, login, key);
    if (data.status == 200) {
      if (data.data.createNewPassword.success == true) {
        if (data.data.createNewPassword.success === true) {
          notify('Password successfully updated.', 'success');
          setPassword('');
          navigate('/login', { replace: true });
        }
      }
    } else {
      notify('Incorrect Key', 'error');
    }
  };

  useEffect(() => {
    if (redirectToHome) {
      window.location.href = redirect;
    }
  }, [redirectToHome, redirect]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setAction(searchParams.get('action'));
    if (searchParams.get('action') == 'rp') setPassword(generatePassword());
    setKey(searchParams.get('key'));
    setLogin(searchParams.get('login'));
  }, [location]);

  return (
    <div className="bg-gradient-to-b from-dark-teal from-20% to-mid-teal bg-fixed min-h-screen top-0">
      <div className="flex flex-col md:flex-row min-h-screen px-8 md:px-0">
        <div className="w-full md:w-1/2">
          <div className="flex flex-row min-h-screen justify-end items-center md:mr-16">
            <div className="w-full md:w-[500px]">
              <div className="flex align-items-center mb-2 justify-between">
                <img
                  src="/images/accent-logo-desktop-white.svg"
                  width="229"
                  height="62"
                  alt="Logo"
                />
              </div>
              {action == null ? (
                <>
                  <h1 className="h2 text-white text-2xl">Sign in</h1>
                  <form className="space-y-4 md:space-y-4 mt-4" action="#">
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
                      onClick={(e) => LoginSubmit(e)}
                    >
                      Sign in
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <h1 className="h2 mb-4 text-white text-2xl">Set Password</h1>
                  <Password
                    getPasswordStrength={getPasswordStrength}
                    password={password}
                    setPassword={setPassword}
                  />
                  <button
                    type="submit"
                    className="mt-4 w-full cursor-pointer text-white bg-mid-teal hover:bg-lighter-teal focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    onClick={() => submitNewPassword()}
                  >
                    Save
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <div className="flex flex-row min-h-screen justify-center items-center md:ml-16"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
