import React from 'react';
import Page404Content from '../Components/Page404Content.jsx';

const Page404 = () => {
  document.title = '404';
  return (
    <div className="bg-gradient-to-b from-dark-teal from-20% to-mid-teal bg-fixed min-h-screen top-0 flex flex-col">
      <div className="pt-0 lg:pt-[14rem] f-1">
        <div className="max-w-screen-2xl mx-auto p-4 2xl:p-0">
          <div className="mt-5 text-center text-2xl leading-9 tracking-tight text-gray-900 w-full">
            <Page404Content />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page404;
