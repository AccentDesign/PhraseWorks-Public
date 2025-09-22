export const PALETTE_ITEMS = [
  {
    id: 'standard',
    title: 'Standard Fields',
    items: [
      {
        id: 'field-1',
        type: 'text',
        label: 'Single Line Text',
        icon: (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M5 17v2h14v-2H5zm4.5-4.2h5l.9 2.2h2.1L12.75 4h-1.5L6.5 15h2.1l.9-2.2zM12 5.98 13.87 11h-3.74L12 5.98z"></path>
          </svg>
        ),
        choicesEnabled: false,
      },
      {
        id: 'field-2',
        type: 'textarea',
        label: 'Paragraph Text',
        icon: (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 448 512"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
          >
            <path d="M448 48v32a16 16 0 0 1-16 16h-48v368a16 16 0 0 1-16 16h-32a16 16 0 0 1-16-16V96h-32v368a16 16 0 0 1-16 16h-32a16 16 0 0 1-16-16V352h-32a160 160 0 0 1 0-320h240a16 16 0 0 1 16 16z"></path>
          </svg>
        ),
        choicesEnabled: false,
      },
      {
        id: 'field-3',
        type: 'dropdown',
        label: 'Dropdown',
        icon: (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 448 512"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
          >
            <path d="M125.1 208h197.8c10.7 0 16.1 13 8.5 20.5l-98.9 98.3c-4.7 4.7-12.2 4.7-16.9 0l-98.9-98.3c-7.7-7.5-2.3-20.5 8.4-20.5zM448 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48zm-48 346V86c0-3.3-2.7-6-6-6H54c-3.3 0-6 2.7-6 6v340c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6z"></path>
          </svg>
        ),
        choicesEnabled: true,
      },
      {
        id: 'field-4',
        type: 'number',
        label: 'Number',
        icon: (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M7 15H5.5v-4.5H4V9h3v6zm6.5-1.5h-3v-1h2c.55 0 1-.45 1-1V10c0-.55-.45-1-1-1H9v1.5h3v1h-2c-.55 0-1 .45-1 1V15h4.5v-1.5zm6 .5v-4c0-.55-.45-1-1-1H15v1.5h3v1h-2v1h2v1h-3V15h3.5c.55 0 1-.45 1-1z"></path>
          </svg>
        ),
        choicesEnabled: false,
      },
      {
        id: 'field-5',
        type: 'checkbox',
        label: 'Checkboxes',
        icon: (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
          >
            <path d="M405.333 64H106.667C83.198 64 64 83.198 64 106.667v298.666C64 428.802 83.198 448 106.667 448h298.666C428.802 448 448 428.802 448 405.333V106.667C448 83.198 428.802 64 405.333 64zm-192 298.667L106.667 256l29.864-29.864 76.802 76.802 162.136-162.136 29.864 29.865-192 192z"></path>
          </svg>
        ),
        choicesEnabled: true,
      },
      {
        id: 'field-6',
        type: 'radio',
        label: 'Radio Buttons',
        icon: (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
          >
            <path d="M256 152c-57.2 0-104 46.8-104 104s46.8 104 104 104 104-46.8 104-104-46.8-104-104-104zm0-104C141.601 48 48 141.601 48 256s93.601 208 208 208 208-93.601 208-208S370.399 48 256 48zm0 374.4c-91.518 0-166.4-74.883-166.4-166.4S164.482 89.6 256 89.6 422.4 164.482 422.4 256 347.518 422.4 256 422.4z"></path>
          </svg>
        ),
        choicesEnabled: true,
      },
      {
        id: 'field-7',
        type: 'hidden',
        label: 'Hidden',
        icon: (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
          >
            <path d="M8.073 12.194 4.212 8.333c-1.52 1.657-2.096 3.317-2.106 3.351L2 12l.105.316C2.127 12.383 4.421 19 12.054 19c.929 0 1.775-.102 2.552-.273l-2.746-2.746a3.987 3.987 0 0 1-3.787-3.787zM12.054 5c-1.855 0-3.375.404-4.642.998L3.707 2.293 2.293 3.707l18 18 1.414-1.414-3.298-3.298c2.638-1.953 3.579-4.637 3.593-4.679l.105-.316-.105-.316C21.98 11.617 19.687 5 12.054 5zm1.906 7.546c.187-.677.028-1.439-.492-1.96s-1.283-.679-1.96-.492L10 8.586A3.955 3.955 0 0 1 12.054 8c2.206 0 4 1.794 4 4a3.94 3.94 0 0 1-.587 2.053l-1.507-1.507z"></path>
          </svg>
        ),
        choicesEnabled: false,
      },
      {
        id: 'field-8',
        type: 'html',
        label: 'HTML',
        icon: (
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
          >
            <path d="m9 7-5 5 5 5"></path>
            <path d="m15 7 5 5-5 5"></path>
          </svg>
        ),
        choicesEnabled: false,
      },
      {
        id: 'field-9',
        type: 'section',
        label: 'Section',
        icon: (
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="0"
            viewBox="0 0 15 15"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2 1.5C2 1.77614 1.77614 2 1.5 2C1.22386 2 1 1.77614 1 1.5C1 1.22386 1.22386 1 1.5 1C1.77614 1 2 1.22386 2 1.5ZM2 5L2 10H13V5H2ZM2 4C1.44772 4 1 4.44772 1 5V10C1 10.5523 1.44772 11 2 11H13C13.5523 11 14 10.5523 14 10V5C14 4.44772 13.5523 4 13 4H2ZM1.5 14C1.77614 14 2 13.7761 2 13.5C2 13.2239 1.77614 13 1.5 13C1.22386 13 1 13.2239 1 13.5C1 13.7761 1.22386 14 1.5 14ZM4 1.5C4 1.77614 3.77614 2 3.5 2C3.22386 2 3 1.77614 3 1.5C3 1.22386 3.22386 1 3.5 1C3.77614 1 4 1.22386 4 1.5ZM3.5 14C3.77614 14 4 13.7761 4 13.5C4 13.2239 3.77614 13 3.5 13C3.22386 13 3 13.2239 3 13.5C3 13.7761 3.22386 14 3.5 14ZM6 1.5C6 1.77614 5.77614 2 5.5 2C5.22386 2 5 1.77614 5 1.5C5 1.22386 5.22386 1 5.5 1C5.77614 1 6 1.22386 6 1.5ZM5.5 14C5.77614 14 6 13.7761 6 13.5C6 13.2239 5.77614 13 5.5 13C5.22386 13 5 13.2239 5 13.5C5 13.7761 5.22386 14 5.5 14ZM8 1.5C8 1.77614 7.77614 2 7.5 2C7.22386 2 7 1.77614 7 1.5C7 1.22386 7.22386 1 7.5 1C7.77614 1 8 1.22386 8 1.5ZM7.5 14C7.77614 14 8 13.7761 8 13.5C8 13.2239 7.77614 13 7.5 13C7.22386 13 7 13.2239 7 13.5C7 13.7761 7.22386 14 7.5 14ZM10 1.5C10 1.77614 9.77614 2 9.5 2C9.22386 2 9 1.77614 9 1.5C9 1.22386 9.22386 1 9.5 1C9.77614 1 10 1.22386 10 1.5ZM9.5 14C9.77614 14 10 13.7761 10 13.5C10 13.2239 9.77614 13 9.5 13C9.22386 13 9 13.2239 9 13.5C9 13.7761 9.22386 14 9.5 14ZM12 1.5C12 1.77614 11.7761 2 11.5 2C11.2239 2 11 1.77614 11 1.5C11 1.22386 11.2239 1 11.5 1C11.7761 1 12 1.22386 12 1.5ZM11.5 14C11.7761 14 12 13.7761 12 13.5C12 13.2239 11.7761 13 11.5 13C11.2239 13 11 13.2239 11 13.5C11 13.7761 11.2239 14 11.5 14ZM14 1.5C14 1.77614 13.7761 2 13.5 2C13.2239 2 13 1.77614 13 1.5C13 1.22386 13.2239 1 13.5 1C13.7761 1 14 1.22386 14 1.5ZM13.5 14C13.7761 14 14 13.7761 14 13.5C14 13.2239 13.7761 13 13.5 13C13.2239 13 13 13.2239 13 13.5C13 13.7761 13.2239 14 13.5 14Z"
              fill="currentColor"
            ></path>
          </svg>
        ),
        choicesEnabled: false,
      },
    ],
  },
  {
    id: 'advanced',
    title: 'Advanced Fields',
    items: [
      {
        id: 'field-14',
        type: 'name',
        label: 'Name',
        icon: (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
          >
            <path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm-50.22 116.82C218.45 151.39 236.28 144 256 144s37.39 7.44 50.11 20.94c12.89 13.68 19.16 32.06 17.68 51.82C320.83 256 290.43 288 256 288s-64.89-32-67.79-71.25c-1.47-19.92 4.79-38.36 17.57-51.93zM256 432a175.49 175.49 0 0 1-126-53.22 122.91 122.91 0 0 1 35.14-33.44C190.63 329 222.89 320 256 320s65.37 9 90.83 25.34A122.87 122.87 0 0 1 382 378.78 175.45 175.45 0 0 1 256 432z"></path>
          </svg>
        ),
        choicesEnabled: false,
      },
      {
        id: 'field-15',
        type: 'date',
        label: 'Date',
        icon: (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"></path>
          </svg>
        ),
        choicesEnabled: false,
      },
      {
        id: 'field-16',
        type: 'time',
        label: 'Time',
        icon: (
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="0"
            viewBox="0 0 15 15"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M7.49998 0.849976C7.22383 0.849976 6.99998 1.07383 6.99998 1.34998V3.52234C6.99998 3.79848 7.22383 4.02234 7.49998 4.02234C7.77612 4.02234 7.99998 3.79848 7.99998 3.52234V1.8718C10.8862 2.12488 13.15 4.54806 13.15 7.49998C13.15 10.6204 10.6204 13.15 7.49998 13.15C4.37957 13.15 1.84998 10.6204 1.84998 7.49998C1.84998 6.10612 2.35407 4.83128 3.19049 3.8459C3.36919 3.63538 3.34339 3.31985 3.13286 3.14115C2.92234 2.96245 2.60681 2.98825 2.42811 3.19877C1.44405 4.35808 0.849976 5.86029 0.849976 7.49998C0.849976 11.1727 3.82728 14.15 7.49998 14.15C11.1727 14.15 14.15 11.1727 14.15 7.49998C14.15 3.82728 11.1727 0.849976 7.49998 0.849976ZM6.74049 8.08072L4.22363 4.57237C4.15231 4.47295 4.16346 4.33652 4.24998 4.25C4.33649 4.16348 4.47293 4.15233 4.57234 4.22365L8.08069 6.74051C8.56227 7.08599 8.61906 7.78091 8.19998 8.2C7.78089 8.61909 7.08597 8.56229 6.74049 8.08072Z"
              fill="currentColor"
            ></path>
          </svg>
        ),
        choicesEnabled: false,
      },
      {
        id: 'field-17',
        type: 'phone',
        label: 'Phone',
        icon: (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
          >
            <path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"></path>
          </svg>
        ),
        choicesEnabled: false,
      },
      {
        id: 'field-18',
        type: 'address',
        label: 'Address',
        icon: (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 384 512"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
          >
            <path d="M384 192c0 87.4-117 243-168.3 307.2c-12.3 15.3-35.1 15.3-47.4 0C117 435 0 279.4 0 192C0 86 86 0 192 0S384 86 384 192z"></path>
          </svg>
        ),
        choicesEnabled: false,
      },
      {
        id: 'field-19',
        type: 'website',
        label: 'Website',
        icon: (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
          >
            <path
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="48"
              d="M200.66 352H144a96 96 0 0 1 0-192h55.41m113.18 0H368a96 96 0 0 1 0 192h-56.66m-142.27-96h175.86"
            ></path>
          </svg>
        ),
        choicesEnabled: false,
      },
      {
        id: 'field-20',
        type: 'email',
        label: 'Email',
        icon: (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"></path>
          </svg>
        ),
        choicesEnabled: false,
      },
      {
        id: 'field-21',
        type: 'upload',
        label: 'File Upload',
        icon: (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
          >
            <path d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"></path>
          </svg>
        ),
        choicesEnabled: false,
      },
    ],
  },
];
