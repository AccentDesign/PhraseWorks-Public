import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useParams } from 'react-router-dom';
import {
  APIAddConfirmationGForm,
  APIAllGetPages,
  APIGetGForm,
  APIUpdateGForm,
} from '../../API/APIForms';
import { APIConnectorContext } from '../../../../Contexts/APIConnectorContext';
import { notify } from '../../../../Utils/Notification';
import PageHeader from './Forms/PageHeader';
import SettingsLinks from './Settings/SettingsLinks';

const FormSettingsConfirmationsNewPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formItems, setFormItems] = useState([]);
  const [confirmationName, setConfirmationName] = useState('');
  const [confirmationType, setConfirmationType] = useState('text');
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(null);
  const [redirectUrl, setRedirectUrl] = useState('');
  const [passData, setPassData] = useState('');
  const [pages, setPages] = useState([]);

  const saveForm = async () => {
    const data = await APIUpdateGForm(loginPassword, id, formTitle, formDescription, formItems);
    if (data.status == 200) {
      if (data.data.updateGForm.success) {
        notify('Successfully updated the form', 'success');
      }
    }
  };

  const saveConfirmation = async () => {
    const data = await APIAddConfirmationGForm(
      loginPassword,
      id,
      confirmationName,
      confirmationType,
      message,
      page,
      redirectUrl,
      passData,
    );
    if (data.status == 200) {
      if (data.data.addGFormConfirmation.success) {
        notify('Successfully added the confirmation to the form', 'success');
        navigate(`/admin/zero-g/form_settings/confirmations/${id}`);
      }
    }
  };

  const fetchData = async () => {
    const data = await APIGetGForm(id);
    if (data.status == 200) {
      if (data.data.getGForm) {
        setFormTitle(data.data.getGForm.title);
        setFormDescription(data.data.getGForm.description);
        setFormItems(data.data.getGForm.fields.fields);
      }
    }
    const pagesData = await APIAllGetPages(loginPassword, 1, 1000000, 'page');
    if (pagesData.status == 200) {
      setPages(pagesData.data.getPosts.posts);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <PageHeader
        formTitle={formTitle}
        setFormTitle={setFormTitle}
        saveForm={saveForm}
        formId={id}
      />
      <div className="px-4">
        <div className="flex flex-col lg:flex-row mt-8 gap-4">
          <SettingsLinks id={id} />
          <div className="shadow-md sm:rounded-lg flex-1">
            <div className="h-full w-full bg-white border border-gray-200 rounded flex flex-col">
              <p className="border-b border-gray-300 p-4 w-full">Confirmations</p>
              <div className="p-4">
                <p className="pb-2">
                  Confirmation Name <span className="text-red-800">(Required)</span>
                </p>
                <p className="pb-2">
                  <input
                    type="text"
                    name="form_title"
                    className="border p-2 rounded w-full"
                    placeholder="Form Title"
                    value={confirmationName}
                    onChange={(e) => {
                      setConfirmationName(e.target.value);
                    }}
                  />
                </p>
                <p className="pb-2">
                  Confirmation Type <span className="text-red-800">(Required)</span>
                </p>
                <div className="flex mb-2">
                  <div className="flex items-center me-4">
                    <input
                      id="confirmation-type-text"
                      type="radio"
                      value="text"
                      name="confirmationType"
                      checked={confirmationType === 'text'}
                      onChange={(e) => setConfirmationType(e.target.value)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                    />
                    <label
                      htmlFor="confirmation-type-text"
                      className="ms-2 text-sm font-medium text-gray-900"
                    >
                      Text
                    </label>
                  </div>
                  <div className="flex items-center me-4">
                    <input
                      id="confirmation-type-page"
                      type="radio"
                      value="page"
                      name="confirmationType"
                      checked={confirmationType === 'page'}
                      onChange={(e) => setConfirmationType(e.target.value)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                    />
                    <label
                      htmlFor="confirmation-type-page"
                      className="ms-2 text-sm font-medium text-gray-900"
                    >
                      Page
                    </label>
                  </div>
                  <div className="flex items-center me-4">
                    <input
                      id="confirmation-type-redirect"
                      type="radio"
                      value="redirect"
                      name="confirmationType"
                      checked={confirmationType === 'redirect'}
                      onChange={(e) => setConfirmationType(e.target.value)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                    />
                    <label
                      htmlFor="confirmation-type-redirect"
                      className="ms-2 text-sm font-medium text-gray-900"
                    >
                      Redirect
                    </label>
                  </div>
                </div>
                {confirmationType == 'text' ? (
                  <>
                    <p className="pb-2">Message</p>
                    <p className="">
                      <textarea
                        type="text"
                        name="message"
                        className="border p-2 rounded w-full"
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                        }}
                      />
                    </p>
                  </>
                ) : confirmationType == 'page' ? (
                  <>
                    <p className="pb-2">
                      Page <span className="text-red-800">(Required)</span>
                    </p>
                    <p className="pb-2">
                      <select
                        className="border p-2 rounded w-full"
                        value={page}
                        onChange={(e) => setPage(e.target.value)}
                      >
                        <option value="">Select a Page</option>
                        {pages.map((page) => (
                          <option key={page.id} value={page.id}>
                            {page.post_title}
                          </option>
                        ))}
                      </select>
                    </p>
                    <p className="pb-2">Pass Field Data via Query String</p>
                    <p className="pb-2 font-light">
                      Sample: phone={'{'}Phone:1{'}'} &amp; email={'{'}Email:2{'}'}
                    </p>
                    <p className="pb-2">
                      <input
                        type="text"
                        name="form_title"
                        className="border p-2 rounded w-full"
                        placeholder=""
                        value={passData}
                        onChange={(e) => {
                          setPassData(e.target.value);
                        }}
                      />
                    </p>
                  </>
                ) : (
                  <>
                    <p className="pb-2">
                      Redirect URL <span className="text-red-800">(Required)</span>
                    </p>
                    <p className="pb-2">
                      <input
                        type="text"
                        name="form_title"
                        className="border p-2 rounded w-full"
                        placeholder=""
                        value={redirectUrl}
                        onChange={(e) => {
                          setRedirectUrl(e.target.value);
                        }}
                      />
                    </p>
                    <p className="pb-2">Pass Field Data via Query String</p>
                    <p className="pb-2 font-light">
                      Sample: phone={'{'}Phone:1{'}'} &amp; email={'{'}Email:2{'}'}
                    </p>
                    <p className="pb-2">
                      <input
                        type="text"
                        name="form_title"
                        className="border p-2 rounded w-full"
                        placeholder=""
                        value={passData}
                        onChange={(e) => {
                          setPassData(e.target.value);
                        }}
                      />
                    </p>
                  </>
                )}
                <button
                  className={`text-white btn ${
                    confirmationName === ''
                      ? 'bg-gray-400 cursor-not-allowed pointer-events-none'
                      : 'bg-blue-700 hover:bg-blue-800'
                  }`}
                  disabled={confirmationName === ''}
                  onClick={saveConfirmation}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormSettingsConfirmationsNewPageContent;
