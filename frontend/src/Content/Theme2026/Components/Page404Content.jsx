import React from 'react';
import { Link } from 'react-router-dom';

const Page404Content = (props) => {
  return (
    <>
      <h1 className="text-2xl text-white">404 - Page Not Found</h1>
      <Link to="/" className="text-sm text-white hover:text-light-teal">
        Back To HomePage
      </Link>
    </>
  );
};

export default Page404Content;
