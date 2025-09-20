import React, { useContext, useEffect, useState } from 'react';
import { APIConnectorContext } from '../../../../Contexts/APIConnectorContext';
import {
  APIUpdatePostPassword,
  APIUpdatePostPublishDate,
  APIUpdatePostStatus,
} from '../../../../API/APIPosts';
import DatePicker from '../../../../Utils/Datepicker';
import PreviewPage from '../../../Utils/PreviewPage';

const Status = ({ updatePost, post, setReloadPost, content, featuredImage, title, categories }) => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [statusEdit, setStatusEdit] = useState(false);
  const [status, setStatus] = useState('draft');
  const [publishDateEdit, setPublishDateEdit] = useState(false);
  const [publishDate, setPublishDate] = useState('');
  const [visibilityEdit, setVisibilityEdit] = useState(false);
  const [visibility, setVisibility] = useState(false);
  const [password, setPassword] = useState('');

  const updatePublishDate = (value) => {
    const [day, month, year] = value.split('/').map(Number);
    const date = new Date(year, month - 1, day);

    date.setHours(12, 0, 0, 0);
    const isoSafe = date.toISOString();
    setPublishDate(isoSafe);
  };

  const updatePostStatus = async () => {
    const data = await APIUpdatePostStatus(loginPassword, status, post.id);
    if (data.status == 200) {
      if (data.data.updatePostStatus.success) {
        setReloadPost(true);
        setStatusEdit(false);
      }
    }
  };

  const updatePostPublishDate = async (date) => {
    const data = await APIUpdatePostPublishDate(loginPassword, date, post.id);
    if (data.status == 200) {
      if (data.data.updatePostPublishDate.success) {
        setReloadPost(true);
        setPublishDateEdit(false);
      }
    }
  };

  const updatePostVisibility = async (newStatus) => {
    const data = await APIUpdatePostStatus(loginPassword, newStatus, post.id);
    if (data.status == 200) {
      if (data.data.updatePostStatus.success) {
        setReloadPost(true);
        setStatusEdit(false);
      }
    }
  };

  const updatePostPasssword = async () => {
    const data = await APIUpdatePostPassword(loginPassword, password, post.id);
    if (data.status == 200) {
      if (data.data.updatePostPassword.success) {
        setReloadPost(true);
        setVisibilityEdit(false);
      }
    }
  };

  const putInTrash = async () => {
    const data = await APIUpdatePostStatus(loginPassword, 'trash', post.id);
    if (data.status == 200) {
      if (data.data.updatePostStatus.success) {
        setReloadPost(true);
      }
    }
  };

  useEffect(() => {
    if (post) {
      setStatus(post.post_status);
      setPublishDate(post.post_date);
      if (post.post_password == null) {
        if (post.post_status == 'private') {
          setVisibility('private');
        } else {
          setVisibility('public');
        }
      } else {
        setVisibility('password');
      }
    }
  }, [post]);
  return (
    <div className="panel">
      <h3 className="font-bold text-lg">Publish</h3>
      <hr className="my-4" />
      <PreviewPage
        post={post}
        content={content}
        featuredImage={featuredImage}
        title={title}
        categories={categories}
        type="page"
      />
      <div className="flex flex-col gap-2 items-start mt-4">
        <div className="flex flex-row items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 mr-2"
          >
            <path
              fillRule="evenodd"
              d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
              clipRule="evenodd"
            />
          </svg>
          <p>
            Status: <strong>{post?.post_status.replace(/\b\w/g, (c) => c.toUpperCase())}</strong>{' '}
            {statusEdit == false && (
              <button
                className="underline underline-offset-4 text-blue-800 hover:text-blue-600"
                onClick={() => setStatusEdit(true)}
              >
                Edit
              </button>
            )}
          </p>
        </div>
        {statusEdit && (
          <div className="flex flex-row items-center gap-4">
            <select
              name="status"
              className="bg-gray-100 border-gray-300 border px-4 py-2 divide-y divide-gray-100 rounded shadow w-44"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="publish">Published</option>
              <option value="pending">Pending Review</option>
              <option value="draft">Draft</option>
            </select>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => {
                updatePostStatus();
              }}
            >
              Ok
            </button>
            <button
              type="button"
              className="underline underline-offset-4 text-blue-800 hover:text-blue-600"
              onClick={() => setStatusEdit(false)}
            >
              Cancel
            </button>
          </div>
        )}

        <div className="flex flex-row items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 mr-2"
          >
            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
            <path
              fillRule="evenodd"
              d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
              clipRule="evenodd"
            />
          </svg>
          <p>
            Visibility:{' '}
            <strong>
              {post?.post_password == null ? (
                <>{post?.post_status == 'private' ? 'Private' : 'Public'}</>
              ) : (
                'Password Protected'
              )}
            </strong>{' '}
            <button
              className="underline underline-offset-4 text-blue-800 hover:text-blue-600"
              onClick={() => setVisibilityEdit(true)}
            >
              Edit
            </button>
          </p>
        </div>
        {visibilityEdit && (
          <div className="flex flex-row items-center gap-4">
            <select
              name="status"
              className="bg-gray-100 border-gray-300 border px-4 py-2 divide-y divide-gray-100 rounded shadow w-44"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="password">PasswordProtected</option>
            </select>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => {
                visibility == 'public' || visibility == 'private'
                  ? updatePostVisibility(visibility == 'public' ? 'publish' : 'private')
                  : updatePostPasssword();
              }}
            >
              Ok
            </button>
            <button
              type="button"
              className="underline underline-offset-4 text-blue-800 hover:text-blue-600"
              onClick={() => setVisibilityEdit(false)}
            >
              Cancel
            </button>
          </div>
        )}
        {visibility == 'password' && (
          <p>
            <input
              type="password"
              className="w-full bg-gray-100 border-gray-300 border px-4 py-2 divide-y divide-gray-100 rounded shadow w-44"
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </p>
        )}
        <div className="flex flex-row items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 mr-2"
          >
            <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
            <path
              fillRule="evenodd"
              d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            Published on: <strong>{new Date(post?.post_date).toDateString()}</strong>{' '}
            <button
              className="underline underline-offset-4 text-blue-800 hover:text-blue-600"
              onClick={() => setPublishDateEdit(true)}
            >
              Edit
            </button>
          </div>
        </div>
        {publishDateEdit && (
          <div className="flex flex-row items-center gap-4">
            <DatePicker
              key={`dp-${publishDate}`}
              id="release-date"
              date={publishDate}
              updateFunction={updatePublishDate}
            />
            <button
              type="button"
              className="secondary-btn"
              onClick={() => {
                updatePostPublishDate(publishDate);
              }}
            >
              Ok
            </button>
            <button
              type="button"
              className="underline underline-offset-4 text-blue-800 hover:text-blue-600"
              onClick={() => setPublishDateEdit(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
      <div
        className={`flex flex-row justify-${post?.post_status == 'trash' ? 'end' : 'between'} mt-4`}
      >
        {post?.post_status != 'trash' && (
          <button
            type="button"
            className="text-red-800 underline underline-offset-4"
            onClick={() => {
              putInTrash();
            }}
          >
            Move To Bin
          </button>
        )}
        <button
          type="button"
          className="ml-4 flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-primary-300 focus:outline-none"
          onClick={() => {
            updatePost();
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
  );
};

export default Status;
