import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import FieldData from '../../CustomFieldComponents/FieldData';
import TypeSelect from '../../CustomFieldComponents/TypeSelect';
import { useEffect, useState } from 'react';

const DraggableRow = ({
  field,
  fields,
  setFields,
  idx,
  expandedIndex,
  toggleRow,
  updateFieldType,
}) => {
  const [fieldData, setFieldData] = useState(field);
  const [updateFields, setUpdateFields] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.order,
  });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    ...(isDragging ? { zIndex: 9999, backgroundColor: 'rgba(0, 0, 255, 0.1)' } : {}),
  };

  useEffect(() => {
    if (updateFields) {
      setUpdateFields(false);
      setFields((prevFields) => prevFields.map((f) => (f.id === fieldData.id ? fieldData : f)));
      toggleRow(idx);
    }
  }, [updateFields]);

  return (
    <>
      <tbody
        ref={setNodeRef}
        style={style}
        {...attributes}
        className="cursor-default"
        id={field.order}
      >
        <tr>
          <td className="flex items-center gap-2 py-2 px-4">
            <span {...listeners} className="cursor-grab">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 320 512"
                height="200px"
                width="200px"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
              >
                <path d="M96 32H32C14.33 32 0 46.33 0 64v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32V64c0-17.67-14.33-32-32-32zm0 160H32c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32v-64c0-17.67-14.33-32-32-32zm0 160H32c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32v-64c0-17.67-14.33-32-32-32zM288 32h-64c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32V64c0-17.67-14.33-32-32-32zm0 160h-64c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32v-64c0-17.67-14.33-32-32-32zm0 160h-64c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32v-64c0-17.67-14.33-32-32-32z"></path>
              </svg>
            </span>
            {idx + 1}
            {expandedIndex === idx ? (
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 20 20"
                aria-hidden="true"
                height="200px"
                width="200px"
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 text-gray-500 cursor-pointer w-4 h-4"
                onClick={() => toggleRow(idx)}
              >
                <path
                  fillRule="evenodd"
                  d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            ) : (
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 20 20"
                aria-hidden="true"
                height="200px"
                width="200px"
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 text-gray-500 cursor-pointer w-4 h-4"
                onClick={() => toggleRow(idx)}
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            )}
          </td>
          <td className="text-blue-500 py-2 px-4">{field.label}</td>
          <td className="py-2 px-4">{field.name}</td>
          <td className="py-2 px-4">{field.type}</td>
        </tr>
        <tr className={expandedIndex === idx ? '' : 'hidden'}>
          <td colSpan="4" className="border-l-4 border-l-blue-500 px-4 pt-4">
            <p>Type</p>
            <TypeSelect type={field.type} setType={updateFieldType} />
            {field.type && (
              <FieldData
                type={field.type}
                fieldData={field}
                setFieldData={setFieldData}
                setUpdateFields={setUpdateFields}
              />
            )}
          </td>
        </tr>
      </tbody>
    </>
  );
};
export default DraggableRow;
