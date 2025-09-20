import { useEffect, useState } from 'react';

import { APIGetCustomFields } from '@/API/APICustomFields';

const CustomFieldCell = ({ postId, fieldName }) => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    const fetchCustomField = async () => {
      const data = await APIGetCustomFields(postId);
      if (data.status == 200 && data.data != null) {
        const dataParsed = JSON.parse(data?.data?.getFields);
        setValue(dataParsed.find((entry) => entry.name == fieldName)?.value);
      }
    };

    fetchCustomField();
  }, [postId, fieldName]);

  return <td>{value ?? '-'}</td>;
};

export default CustomFieldCell;
