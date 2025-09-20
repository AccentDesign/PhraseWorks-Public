import { useEffect, useState } from 'react';
import AddPanel from '../../CustomFieldComponents/AddPanel';

import FieldsTable from './FieldsTable';

const CustomFields = ({ fields, setFields }) => {
  const [sliderAddOpen, setSliderAddOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleRow = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const HandleClose = () => {};

  const updateFieldType = () => {};


  return (
    <div>
      <div className="flex flex-row justify-end items-center">
        <button type="button" className="secondary-btn" onClick={() => setSliderAddOpen(true)}>
          Add Field
        </button>
      </div>

      <FieldsTable
        fields={fields}
        setFields={setFields}
        expandedIndex={expandedIndex}
        toggleRow={toggleRow}
        updateFieldType={updateFieldType}
      />
      <AddPanel
        sliderAddOpen={sliderAddOpen}
        setSliderAddOpen={setSliderAddOpen}
        HandleClose={HandleClose}
        fields={fields}
        setFields={setFields}
      />
    </div>
  );
};

export default CustomFields;
