import React, { useContext, useEffect, useState } from 'react';
import { APIConnectorContext } from '../../../../Contexts/APIConnectorContext';
import { APIGetPostSEO, APIUpdatePostSEO } from '../../../../API/APIPosts';
import { notify } from '../../../../Utils/Notification';
import { APIGetSiteSEOSettings } from '../../../../API/APISystem';
import { APIGetFileById } from '../../../../API/APIMedia';
import PillTextArea from '../../../Utils/PillTextArea';
import PillTextBox from '../../../Utils/PillTextBox';
import SocialImage from '../../../Utils/SocialImage';
import Chevrons from '../../Chevrons';

const SEO = ({ post }) => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const [seo, setSEO] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogUrl, setOgUrl] = useState('');
  const [ogSiteName, setOgSiteName] = useState('');
  const [pageSocialImage, setPageSocialImage] = useState('');
  const [pageSocialImageId, setPageSocialImageId] = useState(null);

  const pillOptions = [
    { name: 'Title', value: 'title' },
    { name: 'Site Title', value: 'siteTitle' },
    { name: 'Seperator', value: 'seperator' },
  ];

  const updateSEO = async () => {
    const seoData = JSON.stringify({
      title: title,
      description: description,
      ogTitle: ogTitle,
      ogDescription: ogDescription,
      ogUrl: ogUrl,
      ogSiteName: ogSiteName,
    });
    const data = await APIUpdatePostSEO(loginPassword, seoData, post.id);

    if (data.status == 200) {
      if (data.data.updatePostSEO.success) {
        notify('Successfully updated SEO', 'success');
      } else {
        notify('Failed to update SEO', 'error');
      }
    } else {
      notify('Failed to update SEO', 'error');
    }
  };

  const fetchImageData = async () => {
    const data = await APIGetFileById(pageSocialImageId);
    if (data.status == 200) {
      setPageSocialImage(data.data.getMediaFileById);
    }
  };

  const fetchData = async () => {
    const dataSiteSEO = await APIGetSiteSEOSettings();
    const data = await APIGetPostSEO(post.id);
    let parsedSiteSEO = null;
    let parsed = null;
    if (dataSiteSEO.status == 200) {
      parsedSiteSEO = JSON.parse(dataSiteSEO.data.getSiteSEOSettings);
    }
    if (data.status == 200) {
      if (data.data.getPostSEO) {
        parsed = JSON.parse(JSON.parse(data.data.getPostSEO));

        setSEO(parsed);
        setTitle(
          parsed && typeof parsed.title === 'string' && parsed.title.trim() !== ''
            ? parsed.title
            : parsedSiteSEO &&
              typeof parsedSiteSEO.pageSEOTitle === 'string' &&
              parsedSiteSEO.pageSEOTitle.trim() !== ''
            ? parsedSiteSEO.pageSEOTitle
            : '',
        );

        setDescription(
          parsed && typeof parsed.description === 'string' && parsed.description.trim() !== ''
            ? parsed.description
            : parsedSiteSEO &&
              typeof parsedSiteSEO.pageDescription === 'string' &&
              parsedSiteSEO.pageDescription.trim() !== ''
            ? parsedSiteSEO.pageDescription
            : '',
        );

        setOgTitle(
          parsed && typeof parsed.ogTitle === 'string' && parsed.ogTitle.trim() !== ''
            ? parsed.ogTitle
            : parsedSiteSEO &&
              typeof parsedSiteSEO.pageSocialTitle === 'string' &&
              parsedSiteSEO.pageSocialTitle.trim() !== ''
            ? parsedSiteSEO.pageSocialTitle
            : '',
        );

        setOgDescription(
          parsed && typeof parsed.ogDescription === 'string' && parsed.ogDescription.trim() !== ''
            ? parsed.ogDescription
            : parsedSiteSEO &&
              typeof parsedSiteSEO.pageSocialDescription === 'string' &&
              parsedSiteSEO.pageSocialDescription.trim() !== ''
            ? parsedSiteSEO.pageSocialDescription
            : '',
        );

        setOgUrl(parsed.ogUrl ? parsed.ogUrl : '');

        setOgSiteName(
          parsed && typeof parsed.ogSiteName === 'string' && parsed.ogSiteName.trim() !== ''
            ? parsed.ogSiteName
            : parsedSiteSEO &&
              typeof parsedSiteSEO.websiteName === 'string' &&
              parsedSiteSEO.websiteName.trim() !== ''
            ? parsedSiteSEO.websiteName
            : '',
        );

        setPageSocialImageId(
          parsed && Number.isInteger(parsed.socialImageId)
            ? parsed.socialImageId
            : parsedSiteSEO && Number.isInteger(parsedSiteSEO.pageSocialImageId)
            ? parsedSiteSEO.pageSocialImageId
            : null,
        );
      } else {
        setTitle(
          parsedSiteSEO &&
            typeof parsedSiteSEO.pageSEOTitle === 'string' &&
            parsedSiteSEO.pageSEOTitle.trim() !== ''
            ? parsedSiteSEO.pageSEOTitle
            : '',
        );

        setDescription(
          parsedSiteSEO &&
            typeof parsedSiteSEO.pageDescription === 'string' &&
            parsedSiteSEO.pageDescription.trim() !== ''
            ? parsedSiteSEO.pageDescription
            : '',
        );

        setOgTitle(
          parsedSiteSEO &&
            typeof parsedSiteSEO.pageSocialTitle === 'string' &&
            parsedSiteSEO.pageSocialTitle.trim() !== ''
            ? parsedSiteSEO.pageSocialTitle
            : '',
        );

        setOgDescription(
          parsedSiteSEO &&
            typeof parsedSiteSEO.pageSocialDescription === 'string' &&
            parsedSiteSEO.pageSocialDescription.trim() !== ''
            ? parsedSiteSEO.pageSocialDescription
            : '',
        );

        setOgSiteName(
          parsedSiteSEO &&
            typeof parsedSiteSEO.websiteName === 'string' &&
            parsedSiteSEO.websiteName.trim() !== ''
            ? parsedSiteSEO.websiteName
            : '',
        );

        setPageSocialImageId(
          parsedSiteSEO && typeof parsedSiteSEO.pageSocialImageId === 'number'
            ? parsedSiteSEO.pageSocialImageId
            : null,
        );
      }
    }
  };

  useEffect(() => {
    if (post?.id) {
      fetchData();
    }
  }, [post]);

  useEffect(() => {
    if (pageSocialImageId != null) {
      fetchImageData();
    }
  }, [pageSocialImageId]);

  return (
    <div className="panel-no-pad mt-8">
      <div className="w-full bg-gray-200 p-4 flex flex-row items-center justify-between">
        <p>SEO</p>
        <Chevrons expanded={isExpanded} setValue={setIsExpanded} />
      </div>

      {isExpanded && (
        <div className="p-4">
          <div className="w-full mb-4">
            <label>SEO Title</label>
            <PillTextBox value={title} setValue={setTitle} variables={pillOptions} />
          </div>
          <div className="w-full mb-4">
            <label className="block">Description</label>
            <PillTextArea value={description} setValue={setDescription} variables={pillOptions} />
          </div>
          <div className="w-full mb-4">
            <SocialImage
              socialImage={pageSocialImage}
              setSocialImage={setPageSocialImage}
              setImageId={setPageSocialImageId}
            />
          </div>
          <div className="w-full mb-4">
            <label>Social Title</label>
            <PillTextBox value={ogTitle} setValue={setOgTitle} variables={pillOptions} />
          </div>
          <div className="w-full mb-4">
            <label className="block">Social Description</label>
            <PillTextArea
              value={ogDescription}
              setValue={setOgDescription}
              variables={pillOptions}
            />
          </div>
          <div className="w-full mb-4">
            <label>Social Url</label>
            <input
              type="text"
              name="ogUrl"
              placeholder="og:Url"
              autoComplete="og:Url"
              value={ogUrl}
              className="input"
              required
              onChange={(e) => {
                setOgUrl(e.target.value);
              }}
            />
          </div>
          <div className="w-full mb-4">
            <label>Social SiteName</label>
            <input
              type="text"
              name="ogSiteName"
              placeholder="og:SiteName"
              autoComplete="og:SiteName"
              value={ogSiteName}
              className="input"
              required
              onChange={(e) => {
                setOgSiteName(e.target.value);
              }}
            />
          </div>
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 btn"
            onClick={() => {
              updateSEO();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 mr-2"
            >
              <path
                fillRule="evenodd"
                d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
                clipRule="evenodd"
              />
            </svg>
            Update
          </button>
        </div>
      )}
    </div>
  );
};

export default SEO;
