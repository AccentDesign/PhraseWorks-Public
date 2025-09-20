import React, { useContext, useEffect, useState } from 'react';
import { APIConnectorContext } from '../../../../Contexts/APIConnectorContext';
import { APIGetPostSEO, APIUpdatePostSEO } from '../../../../API/APIPosts';
import { notify } from '../../../../Utils/Notification';
import PillTextBox from '../../../Utils/PillTextBox';
import PillTextArea from '../../../Utils/PillTextArea';
import SocialImage from '../../../Utils/SocialImage';
import { APIGetSiteSEOSettings } from '../../../../API/APISystem';
import { APIGetFileById } from '../../../../API/APIMedia';

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
  const [postSocialImage, setPostSocialImage] = useState('');
  const [postSocialImageId, setPostSocialImageId] = useState(null);

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
      socialImageId: postSocialImageId,
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
    const data = await APIGetFileById(postSocialImageId);
    if (data.status == 200) {
      setPostSocialImage(data.data.getMediaFileById);
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
              typeof parsedSiteSEO.postSEOTitle === 'string' &&
              parsedSiteSEO.postSEOTitle.trim() !== ''
            ? parsedSiteSEO.postSEOTitle
            : '',
        );

        setDescription(
          parsed && typeof parsed.description === 'string' && parsed.description.trim() !== ''
            ? parsed.description
            : parsedSiteSEO &&
              typeof parsedSiteSEO.postDescription === 'string' &&
              parsedSiteSEO.postDescription.trim() !== ''
            ? parsedSiteSEO.postDescription
            : '',
        );

        setOgTitle(
          parsed && typeof parsed.ogTitle === 'string' && parsed.ogTitle.trim() !== ''
            ? parsed.ogTitle
            : parsedSiteSEO &&
              typeof parsedSiteSEO.postSocialTitle === 'string' &&
              parsedSiteSEO.postSocialTitle.trim() !== ''
            ? parsedSiteSEO.postSocialTitle
            : '',
        );

        setOgDescription(
          parsed && typeof parsed.ogDescription === 'string' && parsed.ogDescription.trim() !== ''
            ? parsed.ogDescription
            : parsedSiteSEO &&
              typeof parsedSiteSEO.postSocialDescription === 'string' &&
              parsedSiteSEO.postSocialDescription.trim() !== ''
            ? parsedSiteSEO.postSocialDescription
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

        setPostSocialImageId(
          parsed && Number.isInteger(parsed.socialImageId)
            ? parsed.socialImageId
            : parsedSiteSEO && Number.isInteger(parsedSiteSEO.postSocialImageId)
            ? parsedSiteSEO.postSocialImageId
            : null,
        );
      } else {
        setTitle(
          parsedSiteSEO &&
            typeof parsedSiteSEO.postSEOTitle === 'string' &&
            parsedSiteSEO.postSEOTitle.trim() !== ''
            ? parsedSiteSEO.postSEOTitle
            : '',
        );

        setDescription(
          parsedSiteSEO &&
            typeof parsedSiteSEO.postDescription === 'string' &&
            parsedSiteSEO.postDescription.trim() !== ''
            ? parsedSiteSEO.postDescription
            : '',
        );

        setOgTitle(
          parsedSiteSEO &&
            typeof parsedSiteSEO.postSocialTitle === 'string' &&
            parsedSiteSEO.postSocialTitle.trim() !== ''
            ? parsedSiteSEO.postSocialTitle
            : '',
        );

        setOgDescription(
          parsedSiteSEO &&
            typeof parsedSiteSEO.postSocialDescription === 'string' &&
            parsedSiteSEO.postSocialDescription.trim() !== ''
            ? parsedSiteSEO.postSocialDescription
            : '',
        );

        setOgSiteName(
          parsedSiteSEO &&
            typeof parsedSiteSEO.websiteName === 'string' &&
            parsedSiteSEO.websiteName.trim() !== ''
            ? parsedSiteSEO.websiteName
            : '',
        );

        setPostSocialImageId(
          parsedSiteSEO && typeof parsedSiteSEO.postSocialImageId === 'number'
            ? parsedSiteSEO.postSocialImageId
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
    if (postSocialImageId != null) {
      fetchImageData();
    }
  }, [postSocialImageId]);

  return (
    <div className="panel-no-pad mt-8">
      <div className="w-full bg-gray-200 p-4 flex flex-row items-center justify-between">
        <p>SEO</p>
        {isExpanded ? (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 20 20"
            aria-hidden="true"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white hover:text-blue-500 cursor-pointer w-4 h-4"
            onClick={() => setIsExpanded(false)}
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        ) : (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 20 20"
            aria-hidden="true"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white hover:text-blue-500 cursor-pointer w-4 h-4"
            onClick={() => setIsExpanded(true)}
          >
            <path
              fillRule="evenodd"
              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        )}
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
              socialImage={postSocialImage}
              setSocialImage={setPostSocialImage}
              setImageId={setPostSocialImageId}
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
