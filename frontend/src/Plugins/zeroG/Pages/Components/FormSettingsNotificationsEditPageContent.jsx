import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useParams } from 'react-router-dom';
import {
  APIAddNotificationGForm,
  APIAllGetPages,
  APIGetFormNotification,
  APIGetGForm,
  APIUpdateNotificationGForm,
  APIUpdateGForm,
} from '../../API/APIForms';
import { APIConnectorContext } from '../../../../Contexts/APIConnectorContext';
import { notify } from '../../../../Utils/Notification';
import PageHeader from './Forms/PageHeader';
import SettingsLinks from './Settings/SettingsLinks';
import Message from './Notifications/Message';

const FormSettingsNotificationsEditPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const { id, notificationId } = useParams();
  const navigate = useNavigate();

  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formItems, setFormItems] = useState([]);
  const [activeContentTab, setActiveContentTab] = useState('visual');

  const [notificationName, setNotificationName] = useState('');
  const [notificationSendTo, setNotificationSendTo] = useState('enterEmail');
  const [sendToEmail, setSendToEmail] = useState('');
  const [emailFieldId, setEmailFieldId] = useState('');
  const [fromName, setFromName] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [replyTo, setReplyTo] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const HandleContentEditorChange = (content) => {
    setMessage(content);
  };

  const HandleContentChange = (e) => {
    const newValue = e.target.value.trim() === '' ? '' : e.target.value;
    setMessage(newValue);
  };

  const saveForm = async () => {
    const data = await APIUpdateGForm(loginPassword, id, formTitle, formDescription, formItems);
    if (data.status == 200) {
      if (data.data.updateGForm.success) {
        notify('Successfully updated the form', 'success');
      }
    }
  };

  const saveNotification = async () => {
    const data = await APIUpdateNotificationGForm(
      loginPassword,
      notificationId,
      id,
      notificationName,
      notificationSendTo,
      sendToEmail,
      emailFieldId,
      fromName,
      fromEmail,
      replyTo,
      bcc,
      subject,
      message,
    );
    if (data.status == 200) {
      if (data.data.updateGFormNotification.success) {
        notify('Successfully added the notification to the form', 'success');
        navigate(`/admin/zero-g/form_settings/notifications/${id}`);
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
    const notificationData = await APIGetFormNotification(notificationId, id);
    if (notificationData.status == 200) {
      if (notificationData.data.getGFormNotification != null) {
        const note = JSON.parse(notificationData.data.getGFormNotification);
        setNotificationName(note.name);
        setNotificationSendTo(note.sendTo);
        setSendToEmail(note.sendToEmail);
        setEmailFieldId(note.emailFieldId);
        setFromName(note.fromName);
        setFromEmail(note.fromEmail);
        setReplyTo(note.replyTo);
        setBcc(note.bcc);
        setSubject(note.subject);
        setMessage(note.message);
      }
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
              <p className="border-b border-gray-300 p-4 w-full">Notifications</p>
              <div className="p-4">
                <p className="pb-2">
                  Notification Name <span className="text-red-800">(Required)</span>
                </p>
                <p className="pb-2">
                  <input
                    type="text"
                    name="form_title"
                    className="border p-2 rounded w-full"
                    placeholder="Notification Name"
                    value={notificationName}
                    onChange={(e) => {
                      setNotificationName(e.target.value);
                    }}
                  />
                </p>
                <p className="pb-2">
                  Notification Type <span className="text-red-800">(Required)</span>
                </p>
                <div className="flex mb-2">
                  <div className="flex items-center me-4">
                    <input
                      id="notification-type-enterEmail"
                      type="radio"
                      value="enterEmail"
                      name="notificationSendTo"
                      checked={notificationSendTo === 'enterEmail'}
                      onChange={(e) => setNotificationSendTo(e.target.value)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                    />
                    <label
                      htmlFor="notification-type-enterEmail"
                      className="ms-2 text-sm font-medium text-gray-900"
                    >
                      Enter Email
                    </label>
                  </div>
                  <div className="flex items-center me-4">
                    <input
                      id="notification-type-selectField"
                      type="radio"
                      value="selectField"
                      name="notificationSendTo"
                      checked={notificationSendTo === 'selectField'}
                      onChange={(e) => setNotificationSendTo(e.target.value)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                    />
                    <label
                      htmlFor="notification-type-selectField"
                      className="ms-2 text-sm font-medium text-gray-900"
                    >
                      Select a Field
                    </label>
                  </div>
                </div>
                {notificationSendTo == 'enterEmail' ? (
                  <>
                    <p className="pb-2">
                      Send To Email <span className="text-red-800">(Required)</span>
                    </p>
                    <p className="pb-2">
                      <input
                        type="text"
                        name="send_to_email"
                        className="border p-2 rounded w-full"
                        placeholder="Send To Email"
                        value={sendToEmail}
                        onChange={(e) => {
                          setSendToEmail(e.target.value);
                        }}
                      />
                    </p>
                  </>
                ) : (
                  <>
                    <p className="pb-2">
                      Field <span className="text-red-800">(Required)</span>
                    </p>
                    <p className="pb-2">
                      <select
                        className="border p-2 rounded w-full"
                        value={emailFieldId}
                        onChange={(e) => setEmailFieldId(e.target.value)}
                      >
                        <option value="">Select a Field</option>
                        {formItems.map((field) => {
                          if (field.type == 'email') {
                            return (
                              <option key={field.id} value={field.id}>
                                {field.label}
                              </option>
                            );
                          }
                        })}
                      </select>
                    </p>
                  </>
                )}
                <p className="pb-2">From Name</p>
                <p className="pb-2">
                  <input
                    type="text"
                    name="from_name"
                    className="border p-2 rounded w-full"
                    placeholder="From Name"
                    value={fromName}
                    onChange={(e) => {
                      setFromName(e.target.value);
                    }}
                  />
                </p>
                <p className="pb-2">From Email</p>
                <p className="pb-2">
                  <input
                    type="text"
                    name="from_email"
                    className="border p-2 rounded w-full"
                    placeholder="From Email"
                    value={fromEmail}
                    onChange={(e) => {
                      setFromEmail(e.target.value);
                    }}
                  />
                </p>
                <p className="pb-2">Reply To</p>
                <p className="pb-2">
                  <input
                    type="text"
                    name="reply_to"
                    className="border p-2 rounded w-full"
                    placeholder="Reply To"
                    value={replyTo}
                    onChange={(e) => {
                      setReplyTo(e.target.value);
                    }}
                  />
                </p>
                <p className="pb-2">BCC</p>
                <p className="pb-2">
                  <input
                    type="text"
                    name="bcc"
                    className="border p-2 rounded w-full"
                    placeholder="BCC"
                    value={bcc}
                    onChange={(e) => {
                      setBcc(e.target.value);
                    }}
                  />
                </p>
                <p className="pb-2">Subject</p>
                <p className="pb-2">
                  <input
                    type="text"
                    name="subject"
                    className="border p-2 rounded w-full"
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value);
                    }}
                  />
                </p>
                <Message
                  activeContentTab={activeContentTab}
                  setActiveContentTab={setActiveContentTab}
                  content={message}
                  HandleContentEditorChange={HandleContentEditorChange}
                  HandleContentChange={HandleContentChange}
                />
                <button
                  className={`text-white btn mt-4 ${
                    notificationName === ''
                      ? 'bg-gray-400 cursor-not-allowed pointer-events-none'
                      : 'bg-blue-700 hover:bg-blue-800'
                  }`}
                  disabled={notificationName === ''}
                  onClick={saveNotification}
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

export default FormSettingsNotificationsEditPageContent;
