import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import PageContent from '../Components/PageContent.jsx';
import HomePageContent from '../Components/HomePageContent.jsx';

const HomePage = () => {
  document.title = 'Dashboard';
  return (
    <div className="bg-gradient-to-b from-dark-teal from-20% to-mid-teal bg-fixed min-h-screen top-0 flex flex-col">
      <div className="pt-[5rem] lg:pt-[8rem] f-1">
        <Header />
        <PageContent>
          <HomePageContent />
        </PageContent>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
