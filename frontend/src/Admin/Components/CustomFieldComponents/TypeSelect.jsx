import React, { useState } from 'react';

const groupedOptions = [
  {
    label: 'Basic',
    options: [
      {
        label: 'Text',
        value: 'text',
        icon: (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            version="1.1"
            viewBox="0 0 17 17"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-2 h-2"
          >
            <g></g>
            <path d="M14 2v3h-1v-2h-4v12h1.643v1h-4.286v-1h1.643v-12h-4v2h-1v-3h11z"></path>
          </svg>
        ),
      },
      {
        label: 'Text Area',
        value: 'text_area',
        icon: (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 16 16"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-2 h-2"
          >
            <path d="M1.5 2.5A1.5 1.5 0 0 1 3 1h10a1.5 1.5 0 0 1 1.5 1.5v3.563a2 2 0 0 1 0 3.874V13.5A1.5 1.5 0 0 1 13 15H3a1.5 1.5 0 0 1-1.5-1.5V9.937a2 2 0 0 1 0-3.874zm1 3.563a2 2 0 0 1 0 3.874V13.5a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V9.937a2 2 0 0 1 0-3.874V2.5A.5.5 0 0 0 13 2H3a.5.5 0 0 0-.5.5zM2 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2m12 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"></path>
            <path d="M11.434 4H4.566L4.5 5.994h.386c.21-1.252.612-1.446 2.173-1.495l.343-.011v6.343c0 .537-.116.665-1.049.748V12h3.294v-.421c-.938-.083-1.054-.21-1.054-.748V4.488l.348.01c1.56.05 1.963.244 2.173 1.496h.386z"></path>
          </svg>
        ),
      },
      {
        label: 'Number',
        value: 'number',
        icon: (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-2 h-2"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="m20.5 10 .5-2h-4l1-4h-2l-1 4h-4l1-4h-2L9 8H5l-.5 2h4l-1 4h-4L3 16h4l-1 4h2l1-4h4l-1 4h2l1-4h4l.5-2h-4l1-4h4zm-7 4h-4l1-4h4l-1 4z"></path>
          </svg>
        ),
      },
      {
        label: 'Range',
        value: 'range',
        icon: (
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-2 h-2"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3 3H11V7H17V13H21V21H13V17H7V11H3V3ZM15 9H9V15H15V9Z"
              fill="currentColor"
            ></path>
          </svg>
        ),
      },
      {
        label: 'Email',
        value: 'email',
        icon: (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-2 h-2"
          >
            <path fill="none" d="M0 0h24v24H0V0z"></path>
            <path d="M12 1.95c-5.52 0-10 4.48-10 10s4.48 10 10 10h5v-2h-5c-4.34 0-8-3.66-8-8s3.66-8 8-8 8 3.66 8 8v1.43c0 .79-.71 1.57-1.5 1.57s-1.5-.78-1.5-1.57v-1.43c0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5c1.38 0 2.64-.56 3.54-1.47.65.89 1.77 1.47 2.96 1.47 1.97 0 3.5-1.6 3.5-3.57v-1.43c0-5.52-4.48-10-10-10zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"></path>
          </svg>
        ),
      },
      {
        label: 'URL',
        value: 'url',
        icon: (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-2 h-2"
          >
            <path
              fill="none"
              strokeMiterlimit="10"
              strokeWidth="32"
              d="M413.48 284.46c58.87 47.24 91.61 89 80.31 108.55-17.85 30.85-138.78-5.48-270.1-81.15S.37 149.84 18.21 119c11.16-19.28 62.58-12.32 131.64 14.09"
            ></path>
            <circle
              cx="256"
              cy="256"
              r="160"
              fill="none"
              strokeMiterlimit="10"
              strokeWidth="32"
            ></circle>
          </svg>
        ),
      },
      {
        label: 'Password',
        value: 'password',
        icon: (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-2 h-2"
          >
            <path d="M16.75 8.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z"></path>
            <path d="M15.75 0a8.25 8.25 0 1 1-2.541 16.101l-1.636 1.636a1.744 1.744 0 0 1-1.237.513H9.25a.25.25 0 0 0-.25.25v1.448a.876.876 0 0 1-.256.619l-.214.213a.75.75 0 0 1-.545.22H5.25a.25.25 0 0 0-.25.25v1A1.75 1.75 0 0 1 3.25 24h-1.5A1.75 1.75 0 0 1 0 22.25v-2.836c0-.464.185-.908.513-1.236l7.386-7.388A8.249 8.249 0 0 1 15.75 0ZM9 8.25a6.733 6.733 0 0 0 .463 2.462.75.75 0 0 1-.168.804l-7.722 7.721a.25.25 0 0 0-.073.177v2.836c0 .138.112.25.25.25h1.5a.25.25 0 0 0 .25-.25v-1c0-.966.784-1.75 1.75-1.75H7.5v-1c0-.966.784-1.75 1.75-1.75h1.086a.25.25 0 0 0 .177-.073l1.971-1.972a.75.75 0 0 1 .804-.168A6.75 6.75 0 1 0 9 8.25Z"></path>
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Content',
    options: [
      {
        label: 'Image',
        value: 'image',
        icon: (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-2 h-2"
          >
            <path d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm-6 336H54a6 6 0 0 1-6-6V118a6 6 0 0 1 6-6h404a6 6 0 0 1 6 6v276a6 6 0 0 1-6 6zM128 152c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zM96 352h320v-80l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L192 304l-39.515-39.515c-4.686-4.686-12.284-4.686-16.971 0L96 304v48z"></path>
          </svg>
        ),
      },
      {
        label: 'File',
        value: 'file',
        icon: (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-2 h-2"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 0 1 5 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 0 0 5 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"></path>
          </svg>
        ),
      },
      {
        label: 'WYSIWYG Editor',
        value: 'wysiwyg',
        icon: (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-2 h-2"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V5a2 2 0 0 0-2-2zm0 16H5V7h14v12zm-2-7H7v-2h10v2zm-4 4H7v-2h6v2z"></path>
          </svg>
        ),
      },
      // { label: 'oEmbed', value: 'o_embed', icon: <ImEmbed className="w-2 h-2" /> },
      // { label: 'Gallery', value: 'gallery', icon: <GrGallery className="w-2 h-2" /> },
    ],
  },
  // {
  //   label: 'Choice',
  //   options: [
  //     { label: 'Select', value: 'select', icon: <TbSelect className="w-2 h-2" /> },
  //     { label: 'Checkbox', value: 'checkbox', icon: <IoIosCheckboxOutline className="w-2 h-2" /> },
  //     { label: 'Radio Button', value: 'radio', icon: <IoIosRadioButtonOn className="w-2 h-2" /> },
  //     { label: 'Button Group', value: 'button_group', icon: <FaLayerGroup className="w-2 h-2" /> },
  //     { label: 'True/False', value: 'true_false', icon: <TiTickOutline className="w-2 h-2" /> },
  //   ],
  // },
  {
    label: 'Relational',
    options: [
      {
        label: 'Link',
        value: 'link',
        icon: (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-2 h-2"
          >
            <g id="Link">
              <g>
                <path d="M10.9,8a4.055,4.055,0,0,1,1.352.135,2.511,2.511,0,0,1-.7,4.863.5.5,0,0,0,0,1,3.508,3.508,0,0,0,2.944-5.2A3.557,3.557,0,0,0,11.434,7H5.59A3.5,3.5,0,0,0,5.4,14c.724.041,1.458,0,2.183,0a.5.5,0,0,0,0-1h0c-1.323,0-2.915.262-3.891-.843A2.522,2.522,0,0,1,5.59,8Z"></path>
                <path d="M18.41,17a3.5,3.5,0,0,0,.192-6.994c-.724-.041-1.458,0-2.183,0a.5.5,0,0,0,0,1h0c1.323,0,2.915-.262,3.891.843A2.522,2.522,0,0,1,18.41,16H13.1a4.055,4.055,0,0,1-1.352-.135,2.511,2.511,0,0,1,.7-4.863.5.5,0,0,0,0-1,3.508,3.508,0,0,0-2.944,5.2A3.557,3.557,0,0,0,12.566,17Z"></path>
              </g>
            </g>
          </svg>
        ),
      },
      {
        label: 'Post Object',
        value: 'post',
        icon: (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-2 h-2"
          >
            <path d="M224 32L64 32C46.3 32 32 46.3 32 64l0 64c0 17.7 14.3 32 32 32l377.4 0c4.2 0 8.3-1.7 11.3-4.7l48-48c6.2-6.2 6.2-16.4 0-22.6l-48-48c-3-3-7.1-4.7-11.3-4.7L288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32zM480 256c0-17.7-14.3-32-32-32l-160 0 0-32-64 0 0 32L70.6 224c-4.2 0-8.3 1.7-11.3 4.7l-48 48c-6.2 6.2-6.2 16.4 0 22.6l48 48c3 3 7.1 4.7 11.3 4.7L448 352c17.7 0 32-14.3 32-32l0-64zM288 480l0-96-64 0 0 96c0 17.7 14.3 32 32 32s32-14.3 32-32z"></path>
          </svg>
        ),
      },
      {
        label: 'Page Link',
        value: 'page_link',
        icon: (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-2 h-2"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M18 20H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2v3zM6 4h7v5h5v2h2V8l-6-6H6c-1.1 0-2 .9-2 2v7h2V4zM9 13h6v2H9zM17 13h6v2h-6zM1 13h6v2H1z"></path>
          </svg>
        ),
      },
      {
        label: 'Relationship',
        value: 'relationship',
        icon: (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-2 h-2"
          >
            <path d="M13.0607 8.11097L14.4749 9.52518C17.2086 12.2589 17.2086 16.691 14.4749 19.4247L14.1214 19.7782C11.3877 22.5119 6.95555 22.5119 4.22188 19.7782C1.48821 17.0446 1.48821 12.6124 4.22188 9.87874L5.6361 11.293C3.68348 13.2456 3.68348 16.4114 5.6361 18.364C7.58872 20.3166 10.7545 20.3166 12.7072 18.364L13.0607 18.0105C15.0133 16.0578 15.0133 12.892 13.0607 10.9394L11.6465 9.52518L13.0607 8.11097ZM19.7782 14.1214L18.364 12.7072C20.3166 10.7545 20.3166 7.58872 18.364 5.6361C16.4114 3.68348 13.2456 3.68348 11.293 5.6361L10.9394 5.98965C8.98678 7.94227 8.98678 11.1081 10.9394 13.0607L12.3536 14.4749L10.9394 15.8891L9.52518 14.4749C6.79151 11.7413 6.79151 7.30911 9.52518 4.57544L9.87874 4.22188C12.6124 1.48821 17.0446 1.48821 19.7782 4.22188C22.5119 6.95555 22.5119 11.3877 19.7782 14.1214Z"></path>
          </svg>
        ),
      },
      // {
      //   label: 'Taxonomy',
      //   value: 'taxonomy',
      //   icon: <MdLabelImportantOutline className="w-2 h-2" />,
      // },
      // { label: 'User', value: 'user', icon: <FaRegUser className="w-2 h-2" /> },
    ],
  },
  // {
  //   label: 'Advanced',
  //   options: [
  //     { label: 'Date Picker', value: 'date', icon: <MdDateRange className="w-2 h-2" /> },
  //     { label: 'Colour Picker', value: 'color', icon: <IoIosColorFill className="w-2 h-2" /> },
  //   ],
  // },
  // {
  //   label: 'Layout',
  //   options: [
  //     { label: 'Group', value: 'group', icon: <FaObjectGroup className="w-2 h-2" /> },
  //     { label: 'Repeater', value: 'repeater', icon: <FaRepeat className="w-2 h-2" /> },
  //     { label: 'FlexibleContent', value: 'flexible', icon: <CgDisplayFlex className="w-2 h-2" /> },
  //   ],
  // },
];

const TypeSelect = ({ type, setType, isUpdate, field }) => {
  const [open, setOpen] = useState(false);

  const selectedLabel =
    groupedOptions.flatMap((group) => group.options).find((opt) => opt.value === type)?.label ||
    'Please select a type...';

  return (
    <div className="relative w-full max-w-sm mb-4">
      <button
        type="button"
        className="w-full text-left bg-white border border-gray-300 px-4 py-2 rounded shadow flex justify-between items-center"
        onClick={() => setOpen(!open)}
      >
        <span>{selectedLabel}</span>
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 448 512"
          height="200px"
          width="200px"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
        >
          <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path>
        </svg>
      </button>

      {open && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded shadow max-h-64 overflow-y-auto">
          {groupedOptions.map((group, groupIdx) => (
            <div key={groupIdx} className="px-2 py-1">
              <div className="text-xs font-semibold text-gray-500 uppercase py-1 px-2">
                {group.label}
              </div>
              {group.options.map((option) => (
                <button
                  key={option.value}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm flex flex-row items-center"
                  onClick={() => {
                    isUpdate ? setType(field.id, option.value) : setType(option.value);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center justify-center bg-blue-50 rounded-full p-1 text-blue-400 border border-blue-300 mr-2">
                    {option.icon ? option.icon : ''}
                  </div>
                  {option.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TypeSelect;
