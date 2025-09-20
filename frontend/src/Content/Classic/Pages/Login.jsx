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
      <div className="bg-gray-200 content min-h-screen top-0">
        <div className="flex flex-col md:flex-row min-h-screen px-8 md:px-0">
          <div className="w-full md:w-1/2">
            <div className="flex flex-row min-h-screen justify-end items-center md:mr-16">
              <div className="w-full md:w-[500px]">
                <div className="flex align-items-center mb-2 justify-between">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 384 512"
                    height="200px"
                    width="200px"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-[50px] h-[62px] text-gray-500"
                  >
                    <path d="M369.9 97.9L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34zM332.1 128H256V51.9l76.1 76.1zM48 464V48h160v104c0 13.3 10.7 24 24 24h104v288H48zm32-48h224V288l-23.5-23.5c-4.7-4.7-12.3-4.7-17 0L176 352l-39.5-39.5c-4.7-4.7-12.3-4.7-17 0L80 352v64zm48-240c-26.5 0-48 21.5-48 48s21.5 48 48 48 48-21.5 48-48-21.5-48-48-48z"></path>
                  </svg>
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
                        class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50"
                        role="alert"
                      >
                        <span class="font-medium">Success!</span> Please check your email for the
                        next step in changing your password.
                      </div>
                    )}
                  </>
                ) : action == 'reset-password' ? (
                  <>
                    <h1 className="h2 mb-4 text-gray-500 text-2xl">Set Password</h1>
                    <Password
                      getPasswordStrength={getPasswordStrength}
                      password={password}
                      setPassword={setPassword}
                      hide={hide}
                      setHide={setHide}
                    />

                    <button
                      type="button"
                      className="mt-4 w-full cursor-pointer text-white bg-mid-teal hover:bg-lighter-teal focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
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
          </div>
          <div className="w-full md:w-1/2">
            <div className="flex flex-row min-h-screen justify-center items-center md:ml-16"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
