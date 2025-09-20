import { Fragment, useEffect, useState } from 'react';
import TextField from '../../CustomFieldComponents/Fields/TextField';
import TextArea from '../../CustomFieldComponents/Fields/TextArea';
import RangeField from '../../CustomFieldComponents/Fields/RangeField';
import ImageField from '../../CustomFieldComponents/Fields/ImageField';
import FileField from '../../CustomFieldComponents/Fields/FileField';
import WYSIWYGField from '../../CustomFieldComponents/Fields/WYSIWYGField';
import LinkField from '../../CustomFieldComponents/Fields/LinkField';
import PostField from '../../CustomFieldComponents/Fields/PostField';
import PageField from '../../CustomFieldComponents/Fields/PageField';
import RelationshipField from '../../CustomFieldComponents/Fields/RelationshipField';

const CustomFields = ({ post, groups, fieldValues, setFieldValues }) => {
  const [fieldsByGroup, setFieldsByGroup] = useState([]);

  const handleChange = (groupId, fieldName, value) => {
    setFieldValues((prev) => ({
      ...prev,
      [groupId]: {
        ...prev[groupId],
        [fieldName]: value,
      },
    }));
  };

  useEffect(() => {
    const fieldGroups = groups.map((group) => ({
      groupId: group.id,
      fields: group.fields,
    }));

    const initialValues = {};
    fieldGroups.forEach(({ groupId, fields }) => {
      initialValues[groupId] = {};
      fields.forEach((field) => {
        initialValues[groupId][field.name] = field.defaultValue || '';
      });
    });

    setFieldsByGroup(fieldGroups);
    setFieldValues(initialValues);
  }, [groups]);

  return (
    <div className="">
      <p className="text-lg font-semibold mb-4">Custom Fields</p>
      {fieldsByGroup.map(({ groupId, fields }) => (
        <div key={groupId} className="mb-6">
          {fields.map((field, idx) => (
            <Fragment key={groupId + '_' + idx}>
              {(field.type === 'text' ||
                field.type === 'email' ||
                field.type == 'number' ||
                field.type == 'url' ||
                field.type == 'password') && (
                <TextField
                  type={field.type}
                  label={field.label}
                  name={field.name}
                  value={fieldValues[groupId]?.[field.name] || ''}
                  setValue={(e) => handleChange(groupId, field.name, e.target.value)}
                />
              )}
              {field.type === 'text_area' && (
                <TextArea
                  type={field.type}
                  label={field.label}
                  name={field.name}
                  value={fieldValues[groupId]?.[field.name] || ''}
                  setValue={(e) => handleChange(groupId, field.name, e.target.value)}
                />
              )}
              {field.type === 'range' && (
                <RangeField
                  type={field.type}
                  label={field.label}
                  name={field.name}
                  value={
                    fieldValues[groupId]?.[field.name] ??
                    Math.floor((field.rangeStart + field.rangeEnd) / 2)
                  }
                  setValue={(e) => handleChange(groupId, field.name, e.target.value)}
                  args={{ rangeStart: field.rangeStart, rangeEnd: field.rangeEnd }}
                />
              )}
              {field.type == 'image' && (
                <ImageField
                  type={field.type}
                  label={field.label}
                  name={field.name}
                  value={fieldValues[groupId]?.[field.name] || ''}
                  setValue={(e) => handleChange(groupId, field.name, e.target.value)}
                />
              )}
              {field.type == 'file' && (
                <FileField
                  type={field.type}
                  label={field.label}
                  name={field.name}
                  value={fieldValues[groupId]?.[field.name] || ''}
                  setValue={(e) => handleChange(groupId, field.name, e.target.value)}
                />
              )}
              {field.type == 'wysiwyg' && (
                <WYSIWYGField
                  type={field.type}
                  label={field.label}
                  name={field.name}
                  value={fieldValues[groupId]?.[field.name] || ''}
                  setValue={(e) => handleChange(groupId, field.name, e.target.value)}
                />
              )}
              {field.type == 'link' && (
                <LinkField
                  type={field.type}
                  label={field.label}
                  name={field.name}
                  value={fieldValues[groupId]?.[field.name] || ''}
                  setValue={(e) => handleChange(groupId, field.name, e.target.value)}
                  args={{ postType: field.postType }}
                />
              )}
              {field.type == 'post' && (
                <PostField
                  type={field.type}
                  label={field.label}
                  name={field.name}
                  value={fieldValues[groupId]?.[field.name] || ''}
                  setValue={(e) => handleChange(groupId, field.name, e.target.value)}
                  args={{ postType: field.postType }}
                />
              )}
              {field.type == 'page_link' && (
                <PageField
                  type={field.type}
                  label={field.label}
                  name={field.name}
                  value={fieldValues[groupId]?.[field.name] || ''}
                  setValue={(e) => handleChange(groupId, field.name, e.target.value)}
                  args={{ postType: field.postType }}
                />
              )}
              {field.type == 'relationship' && (
                <RelationshipField
                  type={field.type}
                  label={field.label}
                  name={field.name}
                  value={fieldValues[groupId]?.[field.name] || ''}
                  setValue={(e) => handleChange(groupId, field.name, e.target.value)}
                  args={{ postType: field.postType }}
                />
              )}
            </Fragment>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CustomFields;
