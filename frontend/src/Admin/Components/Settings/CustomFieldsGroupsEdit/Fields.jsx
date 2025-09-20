import React from 'react';
import CustomFields from './CustomFields';

const Fields = ({ fields, setFields }) => {
  return (
    <div className="panel mt-8 p-4">
      <CustomFields fields={fields} setFields={setFields} />
    </div>
  );
};

export default Fields;
