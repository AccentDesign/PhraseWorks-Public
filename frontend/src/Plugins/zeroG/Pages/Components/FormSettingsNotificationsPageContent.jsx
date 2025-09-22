import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  APIDeleteFormNotification,
  APIGetFormNotifications,
  APIGetGForm,
  APIUpdateGForm,
} from '../../API/APIForms';
import { APIConnectorContext } from '../../../../Contexts/APIConnectorContext';
import { notify } from '../../../../Utils/Notification';
import PageHeader from './Forms/PageHeader';
import SettingsLinks from './Settings/SettingsLinks';

const FormSettingsNotificationsPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const { id } = useParams();
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formItems, setFormItems] = useState([]);
  const [formNotifications, setFormNotification] = useState([]);
  const [reloadNotifications, setReloadNotifications] = useState(false);

  const saveForm = async () => {
    const data = await APIUpdateGForm(loginPassword, id, formTitle, formDescription, formItems);
    if (data.status == 200) {
      if (data.data.updateGForm.success) {
        notify('Successfully updated the form', 'success');
      }
    }
  };

  const trashNotification = async (confId) => {
    const deleteData = await APIDeleteFormNotification(loginPassword, confId, id);
    if (deleteData.status == 200) {
      if (deleteData.data.deleteGFormNotification.success) {
        notify('Successfully deleted the notification for this form', 'success');
        setReloadNotifications(true);
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
    const notificationsData = await APIGetFormNotifications(id);
    if (notificationsData.status == 200) {
      setFormNotification(JSON.parse(notificationsData.data.getGFormNotifications));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (reloadNotifications == true) {
      setReloadNotifications(false);
      fetchData();
    }
  }, [reloadNotifications]);

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
                <div className="flex flex-row justify-end mb-4">
                  <Link
                    to={`/admin/zero-g/form_settings/notifications/new/${id}`}
                    className="text-white bg-blue-700 hover:bg-blue-800 btn"
                  >
                    Add New
                  </Link>
                </div>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th>Subject</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formNotifications.length > 0 ? (
                      <>
                        {formNotifications.map((notification) => (
                          <tr key={notification.id}>
                            <td>
                              <Link
                                to={`/admin/zero-g/form_settings/notifications/edit/${id}/${notification.id}`}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                {notification.name}
                              </Link>
                              <div className="flex flex-row items-center gap-4">
                                <p>
                                  <Link
                                    to={`/admin/zero-g/form_settings/notifications/edit/${id}/${notification.id}`}
                                    className="link-blue-xs"
                                  >
                                    Edit
                                  </Link>
                                </p>
                                <p>
                                  <button
                                    className="link-red-xs"
                                    onClick={() => trashNotification(notification.id)}
                                  >
                                    Trash
                                  </button>
                                </p>
                              </div>
                            </td>
                            <td>{notification.subject}</td>
                          </tr>
                        ))}
                      </>
                    ) : (
                      <tr>
                        <td colSpan="2">No items found.</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th scope="col">Name</th>
                      <th>Type</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormSettingsNotificationsPageContent;
