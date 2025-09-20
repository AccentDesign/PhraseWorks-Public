import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import PageContent from '../Components/PageContent.jsx';
import HomePageContent from '../Components/HomePageContent.jsx';
import HeadMeta from '@/Utils/HeadMeta.jsx';
import ContentWrapper from '../../../Includes/ContentWrapper.jsx';
import Adminbar from '../../../Includes/AdminBar.jsx';
import HomepageHero from '../Components/HomepageHero.jsx';

const HomePage = () => {
  return (
    <>
      <HeadMeta
        pageTitle="Dashboard"
        description="Public dashboard providing an overview of key information and insights accessible to all visitors."
      />
      <div className="bg-gray-200 content min-h-screen top-0 flex flex-col ">
        <ContentWrapper>
          <Adminbar />
          <Header />
          <HomepageHero />
          <PageContent>
            <HomePageContent />
          </PageContent>
        </ContentWrapper>
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
