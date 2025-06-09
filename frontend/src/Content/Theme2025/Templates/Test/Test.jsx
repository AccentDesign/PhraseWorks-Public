import React from 'react';
import Heading from './Components/Heading';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';

const Test = () => {
  return (
    <div className="bg-gradient-to-b from-dark-teal from-20% to-mid-teal bg-fixed min-h-screen top-0 flex flex-col">
      <Header />
      <div className="w-full md:w-[calc(100%-12rem)] mx-auto mt-4">
        <div className="pt-[5rem] lg:pt-[8rem] lg:pb-4 px-4 f-1 bg-white">
          <Heading />
          Test.jsx
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Test;
