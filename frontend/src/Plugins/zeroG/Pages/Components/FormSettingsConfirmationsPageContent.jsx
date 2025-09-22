import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  APIDeleteFormConfirmation,
  APIGetFormConfirmations,
  APIGetGForm,
  APIUpdateGForm,
} from '../../API/APIForms';
import { APIConnectorContext } from '../../../../Contexts/APIConnectorContext';
import { notify } from '../../../../Utils/Notification';
import PageHeader from './Forms/PageHeader';
import SettingsLinks from './Settings/SettingsLinks';

const FormSettingsConfirmationsPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const { id } = useParams();
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formItems, setFormItems] = useState([]);
  const [formConfirmations, setFormConfirmation] = useState([]);
  const [reloadConfirmations, setReloadConfirmations] = useState(false);

  const saveForm = async () => {
    const data = await APIUpdateGForm(loginPassword, id, formTitle, formDescription, formItems);
    if (data.status == 200) {
      if (data.data.updateGForm.success) {
        notify('Successfully updated the form', 'success');
      }
    }
  };

  const trashConfirmation = async (confId) => {
    const deleteData = await APIDeleteFormConfirmation(loginPassword, confId, id);
    if (deleteData.status == 200) {
      if (deleteData.data.deleteGFormConfirmation.success) {
        notify('Successfully deleted the confirmation for this form', 'success');
        setReloadConfirmations(true);
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
    const confirmationsData = await APIGetFormConfirmations(id);
    if (confirmationsData.status == 200) {
      setFormConfirmation(JSON.parse(confirmationsData.data.getGFormConfirmations));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (reloadConfirmations == true) {
      setReloadConfirmations(false);
      fetchData();
    }
  }, [reloadConfirmations]);

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
                <div className="flex flex-row justify-end mb-4">
                  <Link
                    to={`/admin/zero-g/form_settings/confirmations/new/${id}`}
                    className="text-white bg-blue-700 hover:bg-blue-800 btn"
                  >
                    Add New
                  </Link>
                </div>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formConfirmations.length > 0 ? (
                      <>
                        {formConfirmations.map((confirmation) => (
                          <tr key={confirmation.id}>
                            <td>
                              <Link
                                to={`/admin/zero-g/form_settings/confirmations/edit/${id}/${confirmation.id}`}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                {confirmation.name}
                              </Link>
                              <div className="flex flex-row items-center gap-4">
                                <p>
                                  <Link
                                    to={`/admin/zero-g/form_settings/confirmations/edit/${id}/${confirmation.id}`}
                                    className="link-blue-xs"
                                  >
                                    Edit
                                  </Link>
                                </p>
                                <p>
                                  <button
                                    className="link-red-xs"
                                    onClick={() => trashConfirmation(confirmation.id)}
                                  >
                                    Trash
                                  </button>
                                </p>
                              </div>
                            </td>
                            <td>{confirmation.type}</td>
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

export default FormSettingsConfirmationsPageContent;
