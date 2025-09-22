import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  APIGetAdminColumn,
  APIGetAdminColumns,
  APIGetPostTypes,
  APIUpdateAdminColumnsEntries,
} from '../../API/APIAdminColumns';
import TitleBar from './TitleBar';
import AddField from './Edit/AddField';
import { APIConnectorContext } from '@/Contexts/APIConnectorContext';
import { notify } from '@/Utils/Notification';

const EditPageContent = () => {
  const { id } = useParams();
  const { loginPassword } = useContext(APIConnectorContext);
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
    const updatedDbColumns = dbColumns.map((col) => {
      if (col.id === id) {
        return {
          ...col,
          fields: fields,
        };
      }
      return col;
    });
    setDbColumns(updatedDbColumns);
    const data = await APIUpdateAdminColumnsEntries(loginPassword, updatedDbColumns);
    if (data.status == 200) {
      if (data.data.updateAdminColumnsEntries.success) {
        notify('Successfully updated', 'success');
      } else {
        notify('Failed to update', 'error');
      }
    } else {
      notify('Failed to update', 'error');
    }
  };

  const fetchData = async () => {
    const data = await APIGetAdminColumn(id);
    if (data.status == 200) {
      setPostType(data.data.getAdminColumn.postType);
      setFields(data.data.getAdminColumn.fields);
    }
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
      <TitleBar title="Admin Columns - Edit" />
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

export default EditPageContent;
