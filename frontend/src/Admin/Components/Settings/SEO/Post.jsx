import React from 'react';
import PillTextBox from '../../../Utils/PillTextBox';
import PillTextArea from '../../../Utils/PillTextArea';
import SocialImage from '../../../Utils/SocialImage';

const Post = ({
  postSEOTitle,
  setPostSEOTitle,
  postDescription,
  setPostDescription,
  postSocialImage,
  setPostSocialImage,
  postSocialImageId,
  setPostSocialImageId,
  postSocialTitle,
  setPostSocialTitle,
  postSocialDescription,
  setPostSocialDescription,
  submitUpdate,
}) => {
  const pillOptions = [
    { name: 'Title', value: 'title' },
    { name: 'Site Title', value: 'siteTitle' },
    { name: 'Seperator', value: 'seperator' },
    { name: 'Post', value: 'post' },
  ];
  return (
    <div>
      <h2 className="seo-settings-header">Post</h2>
      <h3 className="seo-settings-sub-header">Search appearance</h3>
      <p className="seo-settings-details">
        Determine what your posts should look like in the search results by default. You can always
        customize the settings for individual posts in the SEO metabox.
      </p>
      <div className="w-full mb-4">
        <label>SEO Title</label>
        <PillTextBox value={postSEOTitle} setValue={setPostSEOTitle} variables={pillOptions} />
      </div>
      <div className="w-full mb-4">
        <label className="block">Description</label>
        <PillTextArea
          value={postDescription}
          setValue={setPostDescription}
          variables={pillOptions}
        />
      </div>
      <h3 className="seo-settings-sub-header">Social media appearance</h3>
      <p className="seo-settings-details">
        Determine how your posts should look on social media by default. You can always customize
        the settings for individual posts in the SEO metabox.
      </p>
      <div className="w-full mb-4">
        <SocialImage
          socialImage={postSocialImage}
          setSocialImage={setPostSocialImage}
          setImageId={setPostSocialImageId}
        />
      </div>
      <div className="w-full mb-4">
        <label>Social Title</label>
        <PillTextBox
          value={postSocialTitle}
          setValue={setPostSocialTitle}
          variables={pillOptions}
        />
      </div>
      <div className="w-full mb-4">
        <label className="block">Social Description</label>
        <PillTextArea
          value={postSocialDescription}
          setValue={setPostSocialDescription}
          variables={pillOptions}
        />
      </div>
      <button
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 btn"
        onClick={submitUpdate}
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
  );
};

export default Post;
