import { useState } from 'react';
import { APICreateSystem, APILogError } from '../../API/APISystem';

import { notify } from '../../Utils/Notification';

export default function CreateFirstUser({ setRecheck }) {
  const [displayName, setDisplayName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!displayName || !firstName || !lastName || !email || !password) {
      notify('Please fill in all fields', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await APICreateSystem(email, firstName, lastName, displayName, password);

      if (result?.data?.systemCreate?.success) {
        setRecheck(true);
        notify('System created successfully!', 'success');
      } else {
        notify('Failed to create system', 'error');
      }
    } catch (err) {
      console.error(err);
      await APILogError(err.stack || String(err));
      notify('Error occurred while creating system', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    { label: 'Display Name', value: displayName, setter: setDisplayName, type: 'text' },
    { label: 'First Name', value: firstName, setter: setFirstName, type: 'text' },
    { label: 'Last Name', value: lastName, setter: setLastName, type: 'text' },
    { label: 'Email', value: email, setter: setEmail, type: 'email' },
    { label: 'Password', value: password, setter: setPassword, type: 'password' },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
      {fields.map((f) => (
        <input
          key={f.label}
          type={f.type}
          name={f.label.toLowerCase().replace(' ', '_')}
          placeholder={f.label}
          value={f.value}
          className="input w-full p-2 rounded border border-gray-300"
          required
          onChange={(e) => f.setter(e.target.value)}
          disabled={isSubmitting}
        />
      ))}

      <button
        type="submit"
        className={`mt-4 w-full text-white bg-mid-teal hover:bg-lighter-teal font-medium rounded-lg text-sm px-5 py-2.5 ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating...' : 'Create First User'}
      </button>
    </form>
  );
}
