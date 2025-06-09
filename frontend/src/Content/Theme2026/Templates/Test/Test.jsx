import React from 'react';
import Heading from './Components/Heading';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';

const Test = () => {
  return (
    <>
      <Header />
      <div className="pt-[5rem] lg:pt-[8rem] f-1 bg-white">
        <Heading />
        Test.jsx
      </div>
      <Footer />
    </>
  );
};

export default Test;
