import React from 'react';

const Tabs = ({ currentTab, setCurrentTab }) => {
  return (
    <div className="border-b border-gray-200">
      <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
        <li className="me-2">
          <button
            onClick={() => setCurrentTab('general')}
            className={`text-lg inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg  group ${
              currentTab == 'general'
                ? 'text-blue-600 border-blue-600 hover:text-blue-800 hover:border-blue-800'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-400'
            }`}
          >
            <svg
              className={`w-6 h-6 me-2 ${
                currentTab == 'general'
                  ? 'text-blue-600'
                  : 'text-gray-400 group-hover:text-gray-500'
              }`}
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 576 512"
              height="200px"
              width="200px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"></path>
            </svg>
            General
          </button>
        </li>
        <li className="me-2">
          <button
            onClick={() => setCurrentTab('testEmail')}
            className={`text-lg inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg  group ${
              currentTab == 'testEmail'
                ? 'text-blue-600 border-blue-600 hover:text-blue-800 hover:border-blue-800'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-400'
            }`}
          >
            <svg
              className={`w-6 h-6 me-2 ${
                currentTab == 'testEmail'
                  ? 'text-blue-600'
                  : 'text-gray-400 group-hover:text-gray-500'
              }`}
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              height="200px"
              width="200px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="none" d="M0 0h24v24H0V0z"></path>
              <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"></path>
            </svg>
            Test Email
          </button>
        </li>

        {/* <li className="me-2">
          <button
            onClick={() => setCurrentTab('emailLog')}
            className={`text-lg inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg  group ${
              currentTab == 'emailLog'
                ? 'text-blue-600 border-blue-600 hover:text-blue-800 hover:border-blue-800'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-400'
            }`}
            aria-current="page"
          >
            <svg
              className={`w-6 h-6 me-2 ${
                currentTab == 'emailLog'
                  ? 'text-blue-600'
                  : 'text-gray-400 group-hover:text-gray-500'
              }`}
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              height="200px"
              width="200px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polyline points="21 8 21 21 3 21 3 8"></polyline>
              <rect x="1" y="3" width="22" height="5"></rect>
              <line x1="10" y1="12" x2="14" y2="12"></line>
            </svg>
            Email Log
          </button>
        </li> */}
        <li className="me-2">
          <button
            onClick={() => setCurrentTab('alerts')}
            className={`text-lg inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg  group ${
              currentTab == 'alerts'
                ? 'text-blue-600 border-blue-600 hover:text-blue-800 hover:border-blue-800'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-400'
            }`}
          >
            <svg
              className={`w-6 h-6 me-2 ${
                currentTab == 'alerts' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
              }`}
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              height="200px"
              width="200px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"></path>
              <path d="M12 8v4"></path>
              <path d="M12 16h.01"></path>
            </svg>
            Alerts
          </button>
        </li>
        <li className="me-2">
          <button
            onClick={() => setCurrentTab('misc')}
            className={`text-lg inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg  group ${
              currentTab == 'misc'
                ? 'text-blue-600 border-blue-600 hover:text-blue-800 hover:border-blue-800'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-400'
            }`}
          >
            <svg
              className={`w-6 h-6 me-2 ${
                currentTab == 'misc' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
              }`}
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              height="200px"
              width="200px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="m14.17 13.71 1.4-2.42c.09-.15.05-.34-.08-.45l-1.48-1.16c.03-.22.05-.45.05-.68s-.02-.46-.05-.69l1.48-1.16c.13-.11.17-.3.08-.45l-1.4-2.42c-.09-.15-.27-.21-.43-.15l-1.74.7c-.36-.28-.75-.51-1.18-.69l-.26-1.85a.364.364 0 0 0-.35-.29h-2.8c-.17 0-.32.13-.35.3L6.8 4.15c-.42.18-.82.41-1.18.69l-1.74-.7c-.16-.06-.34 0-.43.15l-1.4 2.42c-.09.15-.05.34.08.45l1.48 1.16c-.03.22-.05.45-.05.68s.02.46.05.69l-1.48 1.16c-.13.11-.17.3-.08.45l1.4 2.42c.09.15.27.21.43.15l1.74-.7c.36.28.75.51 1.18.69l.26 1.85c.03.16.18.29.35.29h2.8c.17 0 .32-.13.35-.3l.26-1.85c.42-.18.82-.41 1.18-.69l1.74.7c.16.06.34 0 .43-.15zM8.81 11c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM21.92 18.67l-.96-.74c.02-.14.04-.29.04-.44 0-.15-.01-.3-.04-.44l.95-.74c.08-.07.11-.19.05-.29l-.9-1.55c-.05-.1-.17-.13-.28-.1l-1.11.45c-.23-.18-.48-.33-.76-.44l-.17-1.18a.216.216 0 0 0-.21-.2h-1.79c-.11 0-.21.08-.22.19l-.17 1.18c-.27.12-.53.26-.76.44l-1.11-.45a.23.23 0 0 0-.28.1l-.9 1.55c-.05.1-.04.22.05.29l.95.74a3.145 3.145 0 0 0 0 .88l-.95.74c-.08.07-.11.19-.05.29l.9 1.55c.05.1.17.13.28.1l1.11-.45c.23.18.48.33.76.44l.17 1.18c.02.11.11.19.22.19h1.79c.11 0 .21-.08.22-.19l.17-1.18c.27-.12.53-.26.75-.44l1.12.45c.1.04.22 0 .28-.1l.9-1.55c.06-.09.03-.21-.05-.28zm-4.29.16a1.35 1.35 0 1 1 .001-2.701 1.35 1.35 0 0 1-.001 2.701z"></path>
            </svg>
            Misc
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Tabs;
