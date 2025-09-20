import { APICreateNewPassword, APIGetUserBy } from '../API/APIUsers';
import { notify } from '../Utils/Notification';

export const get_user_by = async (field, value) => {
  const data = await APIGetUserBy(field, value);
  if (data.status == 200) {
    return data.data.getUserBy;
  }
  return null;
};

export const generatePassword = (length = 12) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export const getPasswordStrength = (password) => {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { label: 'Weak', color: 'bg-red-500', bg: 'bg-red-100', width: 'w-1/5' };
  if (score === 2)
    return { label: 'Fair', color: 'bg-orange-400', bg: 'bg-orange-100', width: 'w-2/5' };
  if (score === 3)
    return { label: 'Good', color: 'bg-yellow-400', bg: 'bg-yellow-100', width: 'w-3/5' };
  if (score === 4)
    return { label: 'Strong', color: 'bg-green-500', bg: 'bg-green-100', width: 'w-4/5' };
  return { label: 'Very Strong', color: 'bg-green-700', bg: 'bg-green-100', width: 'w-full' };
};

export const submitNewPassword = async (password, login, key, setPassword, navigate) => {
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

export const LoginSubmit = async (password, email, setRedirectToHome, LoginUser) => {
  if (password != '') {
    const result = await LoginUser(email, password);
    if (result == true) {
      setRedirectToHome(true);
    }
  } else {
    notify('Incorrect Password', 'error');
  }
};
