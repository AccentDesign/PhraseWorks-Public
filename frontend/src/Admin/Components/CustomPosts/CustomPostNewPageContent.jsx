import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { APIConnectorContext } from '../../../Contexts/APIConnectorContext.jsx';
import TitleBar from './Add/TitleBar';
import {
  APIGetCategories,
  APISaveDraftNewPost,
  APISavePublishNewPost,
  APIUpdatePostSEO,
} from '../../../API/APIPosts';
import Tag from './Add/Tag.jsx';
import Category from './Add/Category.jsx';
import Status from './Add/Status.jsx';
import FeaturedImage from './Add/FeaturedImage.jsx';
import Content from './Add/Content.jsx';
import Title from './Add/Title.jsx';
import { APIGetFileById } from '../../../API/APIMedia.js';
import { notify } from '../../../Utils/Notification';
import CustomFields from './Add/CustomFields';
import {
  APIGetCustomFieldGroupsWhereMatch,
  APIUpdatePostCustomFieldData,
} from '../../../API/APICustomFields';
import SEO from './Add/SEO.jsx';
import { APIGetCustomPostBySlug } from '../../../API/APICustomPosts.js';
import Chevrons from '../Chevrons.jsx';

const CustomPostNewPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const { postType } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [featuredImageId, setFeaturedImageId] = useState(null);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [activeContentTab, setActiveContentTab] = useState('visual');
  const [content, setContent] = useState('');
  const [categoriesSelectedIds, setCategoriesSelectedIds] = useState([]);
  const [tagsSelectedIds, setTagsSelectedIds] = useState([]);
  const [reloadMedia, setReloadMedia] = useState(false);
  const [groups, setGroups] = useState([]);
  const [fieldValues, setFieldValues] = useState({});
  const [contentExpanded, setContentExpanded] = useState(true);
  const [customExpanded, setCustomExpanded] = useState(false);
  const [postSocialImageId, setPostSocialImageId] = useState(null);
  const [postSocialImage, setPostSocialImage] = useState('');
  const [customPostName, setCustomPostName] = useState('');

  const [seo, setSEO] = useState({
    title: '',
    description: '',
    ogTitle: '',
    ogDescription: '',
    ogUrl: '',
    ogSiteName: '',
    socialImageId: postSocialImageId,
  });

  const toggleCategoryCheckbox = (id) => {
    setCategoriesSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleTagCheckbox = (id) => {
    setTagsSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const updateTitle = (value) => {
    if (typeof value !== 'string') return '';
    setTitle(value);
  };

  const HandleContentEditorChange = (content) => {
    setContent(content);
  };

  const HandleContentChange = (e) => {
    const newValue = e.target.value.trim() === '' ? '' : e.target.value;
    setContent(newValue);
  };

  const fetchData = async (isMounted = true) => {
    const postTypePost = await APIGetCustomPostBySlug(postType, loginPassword);
    if (isMounted && postTypePost.status == 200) {
      const post = JSON.parse(postTypePost.data.getCustomPostBySlug);
      setCustomPostName(post.name);
    }
    const data = await APIGetCategories(loginPassword, 'category');
    if (isMounted && data.status == 200) {
      setCategories(data.data.getCategories.categories);
    }
    const tagsData = await APIGetCategories(loginPassword, 'post_tag');
    if (isMounted && tagsData.status == 200) {
      setTags(tagsData.data.getCategories.categories);
    }

    const groupsData = await APIGetCustomFieldGroupsWhereMatch(
      'post_type',
      'is_equal',
      postType,
      loginPassword,
    );

    if (groupsData.status == 200) {
      const groupsParsed = JSON.parse(groupsData.data.getCustomFieldGroupsWhereMatch);
      setGroups(groupsParsed);
    }
  };

  const fetchImageData = async (isMounted = true) => {
    const data = await APIGetFileById(featuredImageId);
    if (isMounted && data.status == 200) {
      setFeaturedImage(data.data.getMediaFileById);
    }
  };

  const fetchImageDataSocial = async (isMounted = true) => {
    const data = await APIGetFileById(postSocialImageId);
    if (isMounted && data.status == 200) {
      setPostSocialImage(data.data.getMediaFileById);
    }
  };

  const submitDraft = async () => {
    if (title == '') {
      notify('Failed to create page, requires a title.', 'error');
      return;
    }
    const data = await APISaveDraftNewPost(
      loginPassword,
      title,
      content,
      featuredImageId,
      categoriesSelectedIds,
      tagsSelectedIds,
      postType,
    );
    if (data.status == 200) {
      notify('Successfully created post.', 'success');
      const postId = data.data.createDraftNewPost.post_id;

      const formattedFields = Object.entries(fieldValues).map(([groupId, fields]) => ({
        group_id: groupId,
        fields: fields,
      }));

      await APIUpdatePostCustomFieldData(formattedFields, postId, loginPassword);
      seo.socialImageId = postSocialImageId;
      const seoData = JSON.stringify(seo);
      await APIUpdatePostSEO(loginPassword, seoData, postId);

      navigate(`/admin/custom/${postType}/edit/${postId}`);
      return;
    }
    notify('Failed to create post.', 'error');
  };

  const submitPublish = async () => {
    if (title == '') {
      notify('Failed to create page, requires a title.', 'error');
      return;
    }
    const data = await APISavePublishNewPost(
      loginPassword,
      title,
      content,
      featuredImageId,
      categoriesSelectedIds,
      tagsSelectedIds,
      postType,
    );
    if (data.status == 200) {
      notify('Successfully created post.', 'success');
      const postId = data.data.createPublishNewPost.post_id;

      const formattedFields = Object.entries(fieldValues).map(([groupId, fields]) => ({
        group_id: groupId,
        fields: fields,
      }));

      await APIUpdatePostCustomFieldData(formattedFields, postId, loginPassword);

      seo.socialImageId = postSocialImageId;
      const seoData = JSON.stringify(seo);

      await APIUpdatePostSEO(loginPassword, seoData, postId);

      navigate(`/admin/custom/${postType}/edit/${postId}`);
      return;
    }
    notify('Failed to create post.', 'error');
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      await fetchData(isMounted);
    };
    load();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (postSocialImageId != null) {
      fetchImageDataSocial(isMounted);
    }

    return () => {
      isMounted = false;
    };
  }, [postSocialImageId]);

  useEffect(() => {
    let isMounted = true;

    if (featuredImageId != null) {
      fetchImageData(isMounted);
    }

    return () => {
      isMounted = false;
    };
  }, [featuredImageId]);

  return (
    <>
      <div className="w-full flex flex-col md:flex-row">
        <div className="w-full md:w-3/4 md:mr-4">
          <TitleBar customPostName={customPostName} />

          <div className="panel mt-8">
            <Title title={title} updateTitle={updateTitle} />
          </div>
          <div className="panel-no-pad mt-8">
            <div className="w-full bg-gray-200 p-4 flex flex-row items-center justify-between">
              <p>Content</p>
              <Chevrons expanded={contentExpanded} setValue={setContentExpanded} />
            </div>
            {contentExpanded && (
              <div className="p-4">
                <Content
                  activeContentTab={activeContentTab}
                  setActiveContentTab={setActiveContentTab}
                  content={content}
                  HandleContentEditorChange={HandleContentEditorChange}
                  HandleContentChange={HandleContentChange}
                />
              </div>
            )}
          </div>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white w-full mt-8">
            <div className="w-full bg-gray-200 p-4 flex flex-row items-center justify-between">
              <p>Custom Fields</p>

              <Chevrons expanded={customExpanded} setValue={setCustomExpanded} />
            </div>
            {customExpanded && (
              <div className="p-4">
                <CustomFields
                  groups={groups}
                  fieldValues={fieldValues}
                  setFieldValues={setFieldValues}
                />
              </div>
            )}
          </div>

          <SEO
            seo={seo}
            setSEO={setSEO}
            setPostSocialImageId={setPostSocialImageId}
            setPostSocialImage={setPostSocialImage}
            postSocialImage={postSocialImage}
            postSocialImageId={postSocialImageId}
          />
        </div>
        <div className="w-full md:w-1/4 md:ml-4">
          <Status
            submitDraft={submitDraft}
            submitPublish={submitPublish}
            content={content}
            featuredImage={featuredImage}
            title={title}
            categories={categories}
          />

          <FeaturedImage
            featuredImage={featuredImage}
            setFeaturedImageId={setFeaturedImageId}
            reloadMedia={reloadMedia}
            setReloadMedia={setReloadMedia}
          />

          <Category
            categories={categories}
            categoriesSelectedIds={categoriesSelectedIds}
            toggleCategoryCheckbox={toggleCategoryCheckbox}
          />

          <Tag
            tags={tags}
            tagsSelectedIds={tagsSelectedIds}
            toggleTagCheckbox={toggleTagCheckbox}
          />
        </div>
      </div>
    </>
  );
};

export default CustomPostNewPageContent;
