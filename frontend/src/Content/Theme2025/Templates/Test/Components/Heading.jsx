import React from 'react';
import AuthorBlock from '../../../Components/Blocks/AuthorBlock';
import DateBlock from '../../../Components/Blocks/DateBlock';
import CategoriesBlock from '../../../Components/Blocks/CategoriesBlock';

const Heading = ({ pageData }) => {
  return (
    <div>
      <h2 className="text-4xl font-bold">{pageData?.post_title}</h2>
      <AuthorBlock post={pageData} />
      <DateBlock post={pageData} />
      <CategoriesBlock post={pageData} />
    </div>
  );
};

export default Heading;
