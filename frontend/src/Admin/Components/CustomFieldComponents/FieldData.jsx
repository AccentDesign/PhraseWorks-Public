import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import NameAndLabelField from './NameAndLabelField';
import ImageField from './ImageField';
import DefaultValueField from './DefaultValueField';
import FileField from './FileField';
import OEmbedField from './OEmbedField';
import ChoicesField from './ChoicesField';
import SelectMultipleField from './SelectMultipleField';
import ReturnValueField from './ReturnValueField';
import MessageField from './MessageField';
import LinkReturnValueField from './LinkReturnValueField';
import PostFields from './PostFields';
import SelectArchiveUrlsField from './SelectArchiveUrlsField';
import FiltersFields from './FiltersFields';
import PostReturnFormat from './PostReturnFormat';
import UserRoleField from './UserRoleField';
import UserFormatField from './UserFormatField';
import RangeField from './RangeField';

const FieldData = ({ type, fieldData, setFieldData, setUpdateFields }) => {
  const [label, setLabel] = useState(fieldData?.label ? fieldData.label : '');
  const [name, setName] = useState(fieldData?.name ? fieldData.name : '');
  const [choices, setChoices] = useState(fieldData?.choices ? fieldData.choices : '');
  const [defaultValue, setDefaultValue] = useState(
    fieldData?.defaultValue ? fieldData.defaultValue : '',
  );
  const [returnFormat, setReturnFormat] = useState('image_array');
  const [choiceReturnFormat, setChoiceReturnFormat] = useState('value');
  const [library, setLibrary] = useState('all');
  const [returnValue, setReturnValue] = useState('file_array');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [selectMultiple, setSelectMultiple] = useState(false);
  const [message, setMessage] = useState('');
  const [linkReturnValue, setLinkReturnValue] = useState('link_array');
  const [postType, setPostType] = useState('');
  const [postStatus, setPostStatus] = useState('');
  const [taxonomy, setTaxonomy] = useState('');
  const [postFormat, setPostFormat] = useState('post_object');
  const [selectArchiveUrls, setSelectArchiveUrls] = useState(true);
  const [filterSearch, setFilterSearch] = useState(true);
  const [filterPostType, setFilterPostType] = useState(true);
  const [filterTaxonomy, setFilterTaxonomy] = useState(true);
  const [filterByRole, setFilterByRole] = useState('');
  const [rangeStart, setRangeStart] = useState(fieldData?.rangeStart ? fieldData.rangeStart : 0);
  const [rangeEnd, setRangeEnd] = useState(fieldData?.rangeEnd ? fieldData.rangeEnd : 10);

  const createField = () => {
    let fieldDataTmp = {
      id: fieldData?.id ? fieldData.id : uuidv4(),
      order: fieldData?.order ? fieldData.order : 0,
      type,
      label,
      name,
    };

    const hasChoices = ['select', 'checkbox', 'radio', 'button_group'];
    const hasDefaultValue = [
      'text',
      'text_area',
      'number',
      'range',
      'email',
      'url',
      'password',
      'date',
      'color',
      'wysiwyg',
      'o_embed',
      'gallery',
      'select',
      'checkbox',
      'radio',
      'button_group',
    ].filter(
      (t) =>
        ![
          'password',
          'image',
          'file',
          'true_false',
          'link',
          'post',
          'page_link',
          'relationship',
          'user',
        ].includes(t),
    );

    const hasReturnFormat = ['image', 'gallery', ...hasChoices];
    const hasLibrary = ['image', 'gallery', 'file'];
    const hasReturnValue = ['file', 'user'];
    const hasMessage = ['true_false'];
    const hasLinkReturnValue = ['link'];
    const hasPostConfig = ['post', 'page_link', 'relationship'];
    const hasRelationshipExtras = ['relationship'];
    const hasPostFormat = ['post', 'relationship'];
    const hasUserExtras = ['user'];
    const hasSelectMultiple = ['select', 'post', 'page_link', 'user'];
    const hasOEmbedDims = ['o_embed'];
    const hasRange = ['range'];

    if (hasChoices.includes(type)) {
      fieldDataTmp.choices = choices;
    }
    if (hasDefaultValue.includes(type)) {
      fieldDataTmp.defaultValue = defaultValue;
    }
    if (hasReturnFormat.includes(type)) {
      fieldDataTmp.returnFormat = returnFormat;
    }
    if (hasLibrary.includes(type)) {
      fieldDataTmp.library = library;
    }
    if (hasReturnValue.includes(type)) {
      fieldDataTmp.returnValue = returnValue;
    }
    if (hasMessage.includes(type)) {
      fieldDataTmp.message = message;
    }
    if (hasLinkReturnValue.includes(type)) {
      fieldDataTmp.linkReturnValue = linkReturnValue;
    }
    if (hasPostConfig.includes(type)) {
      fieldDataTmp.postType = postType;
      fieldDataTmp.postStatus = postStatus;
      fieldDataTmp.taxonomy = taxonomy;
    }
    if (hasRelationshipExtras.includes(type)) {
      fieldDataTmp.filterSearch = filterSearch;
      fieldDataTmp.filterPostType = filterPostType;
      fieldDataTmp.filterTaxonomy = filterTaxonomy;
    }
    if (hasPostFormat.includes(type)) {
      fieldDataTmp.postFormat = postFormat;
    }
    if (hasUserExtras.includes(type)) {
      fieldDataTmp.filterByRole = filterByRole;
    }
    if (hasSelectMultiple.includes(type)) {
      fieldDataTmp.selectMultiple = selectMultiple;
    }
    if (hasOEmbedDims.includes(type)) {
      fieldDataTmp.width = width;
      fieldDataTmp.height = height;
    }
    if (hasRange.includes(type)) {
      fieldDataTmp.rangeStart = rangeStart;
      fieldDataTmp.rangeEnd = rangeEnd;
    }

    setFieldData(fieldDataTmp);
    setUpdateFields(true);
  };

  useEffect(() => {
    if (fieldData?.returnFormat) {
      setReturnFormat(fieldData.returnFormat);
    }
    if (fieldData?.library) {
      setLibrary(fieldData.library);
    }
  }, [fieldData]);

  return (
    <div className="mb-4">
      <NameAndLabelField label={label} setLabel={setLabel} name={name} setName={setName} />
      {(type == 'select' || type == 'checkbox' || type == 'radio' || type == 'button_group') && (
        <ChoicesField choices={choices} setChoices={setChoices} />
      )}
      {type != 'password' &&
        type != 'image' &&
        type != 'file' &&
        type != 'true_false' &&
        type != 'link' &&
        type != 'post' &&
        type != 'page_link' &&
        type != 'relationship' &&
        type != 'user' &&
        type != 'range' && (
          <DefaultValueField
            type={type}
            defaultValue={defaultValue}
            setDefaultValue={setDefaultValue}
          />
        )}
      {(type == 'image' || type == 'gallery') && (
        <ImageField
          key={returnFormat + library}
          returnFormat={returnFormat}
          setReturnFormat={setReturnFormat}
          library={library}
          setLibrary={setLibrary}
        />
      )}
      {type == 'file' && (
        <FileField
          returnValue={returnValue}
          setReturnValue={setReturnValue}
          library={library}
          setLibrary={setLibrary}
        />
      )}
      {type == 'o_embed' && (
        <OEmbedField width={width} setWidth={setWidth} height={height} setHeight={setHeight} />
      )}
      {(type == 'select' || type == 'checkbox' || type == 'radio' || type == 'button_group') && (
        <ReturnValueField
          returnFormat={choiceReturnFormat}
          setReturnFormat={setChoiceReturnFormat}
        />
      )}
      {type == 'true_false' && <MessageField message={message} setMessage={setMessage} />}
      {type == 'link' && (
        <LinkReturnValueField
          linkReturnValue={linkReturnValue}
          setLinkReturnValue={setLinkReturnValue}
        />
      )}
      {(type == 'post' || type == 'page_link' || type == 'relationship') && (
        <PostFields
          postType={postType}
          setPostType={setPostType}
          postStatus={postStatus}
          setPostStatus={setPostStatus}
          taxonomy={taxonomy}
          setTaxonomy={setTaxonomy}
        />
      )}
      {type == 'relationship' && (
        <FiltersFields
          filterSearch={filterSearch}
          setFilterSearch={setFilterSearch}
          filterPostType={filterPostType}
          setFilterPostType={setFilterPostType}
          filterTaxonomy={filterTaxonomy}
          setFilterTaxonomy={setFilterTaxonomy}
        />
      )}
      {(type == 'post' || type == 'relationship') && (
        <PostReturnFormat postFormat={postFormat} setPostFormat={setPostFormat} />
      )}
      {type == 'user' && (
        <UserRoleField filterByRole={filterByRole} setFilterByRole={setFilterByRole} />
      )}
      {type == 'user' && (
        <UserFormatField returnValue={returnValue} setReturnValue={setReturnValue} />
      )}
      {type == 'page_link' && (
        <SelectArchiveUrlsField
          selectArchiveUrls={selectArchiveUrls}
          setSelectArchiveUrls={setSelectArchiveUrls}
        />
      )}
      {(type == 'select' || type == 'post' || type == 'page_link' || type == 'user') && (
        <SelectMultipleField
          selectMultiple={selectMultiple}
          setSelectMultiple={setSelectMultiple}
        />
      )}
      {type == 'range' && (
        <RangeField
          type={type}
          rangeStart={rangeStart}
          setRangeStart={setRangeStart}
          rangeEnd={rangeEnd}
          setRangeEnd={setRangeEnd}
        />
      )}
      <button
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 btn"
        onClick={() => createField()}
      >
        {fieldData == null ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 mr-2"
          >
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 mr-2"
          >
            <path
              fillRule="evenodd"
              d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {fieldData == null ? 'Add' : 'Update'} Field
      </button>
    </div>
  );
};

export default FieldData;
