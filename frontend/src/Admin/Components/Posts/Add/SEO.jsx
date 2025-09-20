import React, { useContext, useEffect, useState } from 'react';
import { APIConnectorContext } from '../../../../Contexts/APIConnectorContext';
import PillTextBox from '../../../Utils/PillTextBox';
import PillTextArea from '../../../Utils/PillTextArea';
import SocialImage from '../../../Utils/SocialImage';
import { APIGetSiteSEOSettings } from '../../../../API/APISystem';

const SEO = ({
  post,
  seo,
  setSEO,
  setPostSocialImageId,
  setPostSocialImage,
  postSocialImage,
  postSocialImageId,
}) => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [isExpanded, setIsExpanded] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogUrl, setOgUrl] = useState('');
  const [ogSiteName, setOgSiteName] = useState('');

  const pillOptions = [
    { name: 'Title', value: 'title' },
    { name: 'Site Title', value: 'siteTitle' },
    { name: 'Seperator', value: 'seperator' },
  ];

  const updateValue = (field, value) => {
    const seoData = {
      title: title,
      description: description,
      ogTitle: ogTitle,
      ogDescription: ogDescription,
      ogUrl: ogUrl,
      ogSiteName: ogSiteName,
    };
    seoData[field] = value;
    setSEO(seoData);
    if (field == 'title') setTitle(value);
    if (field == 'description') setDescription(value);
    if (field == 'ogTitle') setOgTitle(value);
    if (field == 'ogDescription') setOgDescription(value);
    if (field == 'ogUrl') setOgUrl(value);
    if (field == 'ogSiteName') setOgSiteName(value);
  };

  const fetchData = async () => {
    const data = await APIGetSiteSEOSettings();
    let parsedSiteSEO = null;
    if (data.status == 200) {
      parsedSiteSEO = JSON.parse(data.data.getSiteSEOSettings);
    }

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
  };

  useEffect(() => {
    fetchData();
  }, []);

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
            <label>og:Url</label>
            <input
              type="text"
              name="ogUrl"
              placeholder="og:Url"
              autoComplete="og:Url"
              value={ogUrl}
              className="input"
              required
              onChange={(e) => {
                updateValue('ogUrl', e.target.value);
              }}
            />
          </div>
          <div className="w-full mb-4">
            <label>og:SiteName</label>
            <input
              type="text"
              name="ogSiteName"
              placeholder="og:SiteName"
              autoComplete="og:SiteName"
              value={ogSiteName}
              className="input"
              required
              onChange={(e) => {
                updateValue('ogSiteName', e.target.value);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SEO;
