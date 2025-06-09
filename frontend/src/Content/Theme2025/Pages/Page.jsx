import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import PageContent from '../Components/PageContent.jsx';

import Content from '../../../Utils/Content.jsx';

const Page = ({ pageData, posts, total, page, perPage, setPage }) => {
  document.title = 'Page';

  return (
    <div className="bg-gradient-to-b from-dark-teal from-20% to-mid-teal bg-fixed min-h-screen top-0 flex flex-col">
      <div className="pt-[5rem] lg:pt-[8rem] f-1">
        <Header />
        <PageContent>
          <h2>{pageData?.post_title}</h2>

          <Content
            pageData={pageData}
            posts={posts}
            total={total}
            page={page}
            perPage={perPage}
            setPage={setPage}
          />
        </PageContent>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
