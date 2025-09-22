import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '@/Contexts/UserContext';
import Password from '../Components/Login/Password';
import { generatePassword, getPasswordStrength, LoginSubmit } from '@/Includes/Users';
import HeadMeta from '@/Utils/HeadMeta';
import SignInForm from '@/Includes/Shortcodes/SignInForm';
import ForgottenPasswordForm from '../../../Includes/Shortcodes/ForgottenPasswordForm';
import { APIForgottenPassword, APIResetPassword } from '../../../API/APIAuth';
import { notify } from '../../../Utils/Notification';

const Login = () => {
  const { LoginUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [action, setAction] = useState(null);
  const [key, setKey] = useState(null);
  const [token, setToken] = useState(null);
  const [login, setLogin] = useState(null);
  const [hide, setHide] = useState(true);
  const [resetDone, setResetDone] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const redirect = queryParams.get('redirect') || '/';

  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [email2, setEmail2] = useState('');
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (redirectToHome) {
      window.location.href = redirect;
    }
  }, [redirectToHome, redirect]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setAction(searchParams.get('action'));
    setKey(searchParams.get('key'));
    setToken(searchParams.get('token'));
    setLogin(searchParams.get('login'));
  }, [location]);

  const calculateForgottenPasswordErrors = (values) => {
    const tmpErrors = [];
    if (values.email != values.email2) {
      tmpErrors.push({ field: 'confirmEmail', error: 'Email addresses must match' });
    }
    setErrors(tmpErrors);
  };

  const ForgottenPasswordSubmit = async () => {
    if (errors.length > 0) return;
    const data = await APIForgottenPassword(email);
    if (data.status == 200 && data.data.forgottenPassword.success) {
      setResetDone(true);
    }
  };

  const ResetPassword = async () => {
    const data = await APIResetPassword(token, password);
    if (data.status == 200 && data.data.resetPassword.success) {
      notify('Successfully changed password', 'success');
      navigate('/login');
    }
  };

  return (
    <>
      <HeadMeta
        pageTitle="Login"
        description="Secure login page for accessing your account and managing your dashboard."
      />
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <div className="text-center">
            <a href="/">
              <img
                src="/images/pw-full.svg"
                className="w-[220px] inline-block"
                alt="Logo Image"
                loading="lazy"
              />
            </a>
          </div>
          {action == 'forgottenPassword' ? (
            <>
              {resetDone == false ? (
                <ForgottenPasswordForm
                  email={email}
                  setEmail={setEmail}
                  email2={email2}
                  setEmail2={setEmail2}
                  ForgottenPasswordSubmit={ForgottenPasswordSubmit}
                  errors={errors}
                  setErrors={setErrors}
                  calculateForgottenPasswordErrors={calculateForgottenPasswordErrors}
                />
              ) : (
                <div
                  className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50"
                  role="alert"
                >
                  <span className="font-medium">Success!</span> Please check your email for the next
                  step in changing your password.
                </div>
              )}
            </>
          ) : action == 'reset-password' ? (
            <>
              <div className="text-center">
                <h1 className="text-gray-900 text-3xl mt-4 font-medium">Reset Password</h1>
                <p className="text-gray-500 text-sm mt-2">Please fill in to continue</p>
              </div>
              <Password
                getPasswordStrength={getPasswordStrength}
                password={password}
                setPassword={setPassword}
                hide={hide}
                setHide={setHide}
              />

              <button
                type="button"
                className="mt-4 w-full cursor-pointer text-white bg-menu-accent hover:bg-menu-primary rounded-full focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-5 py-2.5 text-center"
                onClick={(e) => {
                  e.preventDefault(); // stops form submit
                  ResetPassword();
                }}
              >
                Save
              </button>
            </>
          ) : (
            <>
              <SignInForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                LoginSubmit={(e) => {
                  e.preventDefault();
                  LoginSubmit(password, email, setRedirectToHome, LoginUser);
                }}
              />
              <div className="flex justify-end mt-2">
                <Link
                  to="/login?action=forgottenPassword"
                  className="text-blue-500 hover:text-blue-800 hover:underline hover:underline-offset-4"
                >
                  Forgotten Password
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
