import React, { useContext, useEffect, useState } from 'react';
import TitleBar from './SEO/TitleBar';

import { APIConnectorContext } from '../../../Contexts/APIConnectorContext';
import Sidebar from './SEO/Sidebar';
import SiteBasics from './SEO/SiteBasics';
import Page from './SEO/Page';
import Post from './SEO/Post';
import Social from './SEO/Social';
import { APIGetFileById } from '../../../API/APIMedia';
import { notify } from '../../../Utils/Notification';
import { APIGetSiteSEOSettings, APIUpdateSiteSEOSettings } from '../../../API/APISystem';

const SEOSettingsPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [expanded, setExpandedState] = useState([
    { name: 'general', expanded: true },
    { name: 'content', expanded: false },
    { name: 'social', expanded: false },
  ]);

  const [activeTab, setActiveTab] = useState('site_basics');
  const [websiteName, setWebsiteName] = useState('');
  const [seperator, setSeperator] = useState('');

  const [pageSEOTitle, setPageSEOTitle] = useState('');
  const [pageDescription, setPageDescription] = useState('');
  const [pageSocialImage, setPageSocialImage] = useState('');
  const [pageSocialImageId, setPageSocialImageId] = useState(null);
  const [pageSocialTitle, setPageSocialTitle] = useState('');
  const [pageSocialDescription, setPageSocialDescription] = useState('');

  const [postSEOTitle, setPostSEOTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [postSocialImage, setPostSocialImage] = useState('');
  const [postSocialImageId, setPostSocialImageId] = useState(null);
  const [postSocialTitle, setPostSocialTitle] = useState('');
  const [postSocialDescription, setPostSocialDescription] = useState('');

  const [defaultSocialImage, setDefaultSocialImage] = useState('');
  const [defaultSocialImageId, setDefaultSocialImageId] = useState(null);

  const updateExpanded = (type, value) => {
    const tmpExpanded = expanded.map((item) =>
      item.name === type ? { ...item, expanded: value } : item,
    );
    setExpandedState(tmpExpanded);
  };

  const fetchData = async () => {
    const data = await APIGetSiteSEOSettings();
    if (data.status == 200) {
      const seoData = JSON.parse(data.data.getSiteSEOSettings);
      setWebsiteName(seoData.websiteName);
      setSeperator(seoData.seperator);
      setPageSEOTitle(seoData.pageSEOTitle);
      setPageDescription(seoData.pageDescription);
      setPageSocialImageId(seoData.pageSocialImageId);
      setPageSocialTitle(seoData.pageSocialTitle);
      setPageSocialDescription(seoData.pageSocialDescription);

      setPostSEOTitle(seoData.postSEOTitle);
      setPostDescription(seoData.postDescription);
      setPostSocialImageId(seoData.postSocialImageId);
      setPostSocialTitle(seoData.postSocialTitle);
      setPostSocialDescription(seoData.postSocialDescription);

      setDefaultSocialImageId(seoData.defaultSocialImageId);
    }
  };

  const submitUpdate = async () => {
    const seoSettings = {
      websiteName,
      seperator,
      pageSEOTitle,
      pageDescription,
      pageSocialImage,
      pageSocialImageId,
      pageSocialTitle,
      pageSocialDescription,
      postSEOTitle,
      postDescription,
      postSocialImageId,
      postSocialTitle,
      postSocialDescription,
      defaultSocialImageId,
    };
    const data = await APIUpdateSiteSEOSettings(loginPassword, seoSettings);
    if (data.status == 200) {
      if (data.data.updateSiteSEOSettings.success) {
        notify('Updated site SEO settings successfully', 'success');
      } else {
        notify('Failed to update site SEO settings', 'error');
      }
    } else {
      notify('Failed to update site SEO settings', 'error');
    }
  };

  const fetchImageData = async (id, type) => {
    const data = await APIGetFileById(id);
    if (data.status == 200) {
      if (type == 'page') {
        setPageSocialImage(data.data.getMediaFileById);
      } else if (type == 'post') {
        setPostSocialImage(data.data.getMediaFileById);
      } else {
        setDefaultSocialImage(data.data.getMediaFileById);
      }
    }
  };

  useEffect(() => {
    if (pageSocialImageId != null) {
      fetchImageData(pageSocialImageId, 'page');
    }
  }, [pageSocialImageId]);

  useEffect(() => {
    if (postSocialImageId != null) {
      fetchImageData(postSocialImageId, 'post');
    }
  }, [postSocialImageId]);

  useEffect(() => {
    if (defaultSocialImageId != null) {
      fetchImageData(defaultSocialImageId, 'default');
    }
  }, [defaultSocialImageId]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="w-full">
        <TitleBar />

        <div className="panel mt-8 mt-8 flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-1/6 min-w-[200px]">
            <Sidebar
              expanded={expanded}
              updateExpanded={updateExpanded}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
          <div className="w-full lg:w-5/6">
            {activeTab == 'site_basics' ? (
              <SiteBasics
                websiteName={websiteName}
                setWebsiteName={setWebsiteName}
                seperator={seperator}
                setSeperator={setSeperator}
                submitUpdate={submitUpdate}
              />
            ) : activeTab == 'page' ? (
              <Page
                pageSEOTitle={pageSEOTitle}
                setPageSEOTitle={setPageSEOTitle}
                pageDescription={pageDescription}
                setPageDescription={setPageDescription}
                pageSocialImage={pageSocialImage}
                setPageSocialImage={setPageSocialImage}
                pageSocialImageId={pageSocialImageId}
                setPageSocialImageId={setPageSocialImageId}
                pageSocialTitle={pageSocialTitle}
                setPageSocialTitle={setPageSocialTitle}
                pageSocialDescription={pageSocialDescription}
                setPageSocialDescription={setPageSocialDescription}
                submitUpdate={submitUpdate}
              />
            ) : activeTab == 'post' ? (
              <Post
                postSEOTitle={postSEOTitle}
                setPostSEOTitle={setPostSEOTitle}
                postDescription={postDescription}
                setPostDescription={setPostDescription}
                postSocialImage={postSocialImage}
                setPostSocialImage={setPostSocialImage}
                postSocialImageId={postSocialImageId}
                setPostSocialImageId={setPostSocialImageId}
                postSocialTitle={postSocialTitle}
                setPostSocialTitle={setPostSocialTitle}
                postSocialDescription={postSocialDescription}
                setPostSocialDescription={setPostSocialDescription}
                submitUpdate={submitUpdate}
              />
            ) : (
              <Social
                defaultSocialImage={defaultSocialImage}
                setDefaultSocialImage={setDefaultSocialImage}
                defaultSocialImageId={defaultSocialImageId}
                setDefaultSocialImageId={setDefaultSocialImageId}
                submitUpdate={submitUpdate}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SEOSettingsPageContent;
