import React, { useEffect, useState } from 'react';
import { generatePassword, getPasswordStrength } from '@/Includes/Users';
import HeadMeta from '@/Utils/HeadMeta';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import PageContent from '../Components/PageContent.jsx';
import { notify } from '../../../Utils/Notification.jsx';
import { APICreateUserNew } from '../../../API/APIUsers.js';
import { useNavigate } from 'react-router-dom';
import ContentWrapper from '../../../Includes/ContentWrapper.jsx';
//APICreateUserNew

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');

  const [strength, setStrength] = useState(0);

  const createUser = async () => {
    let errors = 0;
    if (email == '') {
      notify('Email is required to sign up', 'error');
      errors++;
    }
    if (firstName == '') {
      notify('First Name is required to sign up', 'error');
      errors++;
    }
    if (lastName == '') {
      notify('Last Name is required to sign up', 'error');
      errors++;
    }
    if (displayName == '') {
      notify('Display Name is required to sign up', 'error');
      errors++;
    }
    if (password == '') {
      notify('Password is required to sign up', 'error');
      errors++;
    }

    if (strength.label == 'Weak' || strength.label == 'Fair') {
      notify('Password needs to be stronger to sign up', 'error');
      errors++;
    }
    if (errors == 0) {
      const data = await APICreateUserNew(email, firstName, lastName, displayName, password);
      if (data.status == 200 && data.data.userCreate.success) {
        notify('User created successfully', 'success');
        navigate('/login', { replace: true });
      }
    }
  };

  useEffect(() => {
    setPassword(generatePassword());
  }, []);

  useEffect(() => {
    setStrength(getPasswordStrength(password));
  }, [password]);

  return (
    <>
      <HeadMeta pageTitle="Sign Up" />
      <div className="bg-gray-200 content min-h-screen top-0 flex flex-col">
        <ContentWrapper>
          <Header />
          <PageContent>
            <h1 className="text-4xl font-bold mb-4">Sign Up</h1>
            <div className="flex flex-col gap-4">
              <div>
                <input
                  type="display_name"
                  name="display_name"
                  id="display_name"
                  placeholder="Display Name"
                  autoComplete="Display Name"
                  value={displayName}
                  className="input"
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
                  className="input"
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
                  className="input"
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
                  className="input"
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
                  className="input"
                  required=""
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className={`mt-1 ${strength.bg} px-4 py-2`}>
                  <div className="w-full bg-gray-200 rounded h-2">
                    <div
                      className={`h-2 rounded ${strength.color} ${strength.width}`}
                      style={{ transition: 'width 0.3s ease' }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{strength.label}</p>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 btn mt-4"
              onClick={() => createUser()}
            >
              Sign Up
            </button>
          </PageContent>
        </ContentWrapper>
      </div>
    </>
  );
};

export default SignUp;
