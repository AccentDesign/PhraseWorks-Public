import React, { useContext, useEffect, useState } from 'react';
import {
  APIGetAdminColumns,
  APIGetPostTypes,
  APIUpdateAdminColumnsEntries,
} from '../../API/APIAdminColumns';
import TitleBar from './Add/TitleBar';
import AddField from './Edit/AddField';
import { APIConnectorContext } from '@/Contexts/APIConnectorContext';
import { notify } from '@/Utils/Notification';
import { useNavigate } from 'react-router-dom';

const AddPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const navigate = useNavigate();
  const [dbColumns, setDbColumns] = useState([]);
  const [postType, setPostType] = useState('');
  const [fields, setFields] = useState([]);
  const [postTypes, setPostTypes] = useState([]);
  const [addSliderOpen, setAddSliderOpen] = useState(false);

  const onMoveFieldUp = (index) => {
    const newFields = [...fields];
    [newFields[index - 1], newFields[index]] = [newFields[index], newFields[index - 1]];
    setFields(newFields);
  };

  const onMoveFieldDown = (index) => {
    const newFields = [...fields];
    [newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]];
    setFields(newFields);
  };

  const handleAddField = (newField) => {
    setFields([...fields, newField]);
  };

  const onDeleteField = (index) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  const saveData = async () => {
    const id = crypto.randomUUID();
    const newEntry = {
      id,
      postType: postType,
      fields: fields,
    };

    const updatedDbColumns = [...dbColumns, newEntry];
    setDbColumns(updatedDbColumns);
    const data = await APIUpdateAdminColumnsEntries(loginPassword, updatedDbColumns);
    if (data.status == 200) {
      if (data.data.updateAdminColumnsEntries.success) {
        notify('Successfully updated', 'success');
        navigate('/admin/admin-columns');
      } else {
        notify('Failed to update', 'error');
      }
    } else {
      notify('Failed to update', 'error');
    }
  };

  const fetchData = async () => {
    const tmpFields = [
      {
        name: 'id',
        title: 'ID',
        order: 1,
      },
      {
        name: 'title',
        title: 'Title',
        order: 2,
      },
      {
        name: 'author',
        title: 'Author',
        order: 3,
      },
      {
        name: 'categories',
        title: 'Categories',
        order: 4,
      },
      {
        name: 'tags',
        title: 'Tags',
        order: 5,
      },
      {
        name: 'date',
        title: 'Date',
        order: 6,
      },
    ];

    setFields(tmpFields);

    const ptData = await APIGetPostTypes();
    if (ptData.status == 200) {
      setPostTypes(ptData.data.getPostTypes);
    }

    const dBdata = await APIGetAdminColumns();
    if (dBdata.status == 200) {
      setDbColumns(dBdata.data.getAdminColumns);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full px-4 py-4">
      <TitleBar title="Admin Columns - Add" />
      <div className="panel mt-8">
        <p className="pb-2">Post Type</p>
        <select
          name="consent_location"
          value={postType}
          onChange={(e) => setPostType(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="">Select a post type</option>
          {postTypes
            .filter((pt) => !dbColumns.some((col) => col.postType === pt && pt !== postType))
            .map((pt, idx) => (
              <option key={idx} value={pt}>
                {pt}
              </option>
            ))}
        </select>

        <div className="flex flex-row items-center justify-between pt-4 pb-2">
          <p className="py-2">Fields</p>
          <button
            type="button"
            className="ml-4 text-white bg-blue-700 hover:bg-blue-800 btn"
            onClick={() => setAddSliderOpen(true)}
          >
            Add Field
          </button>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Title</th>
              <th scope="col">Order</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, idx) => {
              return (
                <tr key={idx}>
                  <td>{field.name}</td>
                  <td>{field.title}</td>
                  <td className="flex gap-2">
                    {field.order}
                    {idx > 0 && (
                      <button onClick={() => onMoveFieldUp(idx)} title="Move Up">
                        <span>&uarr;</span>
                      </button>
                    )}
                    {idx < fields.length - 1 && (
                      <button onClick={() => onMoveFieldDown(idx)} title="Move Down">
                        <span>&darr;</span>
                      </button>
                    )}
                  </td>
                  <td>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => onDeleteField(idx)}
                      title="Delete Field"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <button
          type="button"
          className="my-4 text-white bg-blue-700 hover:bg-blue-800 btn"
          onClick={() => saveData()}
        >
          Save
        </button>
      </div>
      <AddField
        addSliderOpen={addSliderOpen}
        setAddSliderOpen={setAddSliderOpen}
        fields={fields}
        onAddField={handleAddField}
        postType={postType}
      />
    </div>
  );
};

export default AddPageContent;
