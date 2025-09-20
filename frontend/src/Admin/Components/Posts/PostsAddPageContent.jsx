import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIConnectorContext } from '../../../Contexts/APIConnectorContext.jsx';
import TitleBar from './Add/TitleBar';
import {
  APIGetCategories,
  APISaveDraftNewPost,
  APISavePublishNewPost,
  APISaveScheduledNewPost,
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
  APIGetPostCustomFieldData,
  APIUpdatePostCustomFieldData,
} from '../../../API/APICustomFields';
import SEO from './Add/SEO.jsx';
import Chevrons from '../Chevrons.jsx';

const PostsAddPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
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
  const [publishDateEdit, setPublishDateEdit] = useState(false);
  const [publishDate, setPublishDate] = useState('');

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

  const fetchData = async () => {
    const data = await APIGetCategories(loginPassword, 'category');
    if (data.status == 200) {
      setCategories(data.data.getCategories.categories);
    }
    const tagsData = await APIGetCategories(loginPassword, 'post_tag');
    if (tagsData.status == 200) {
      setTags(tagsData.data.getCategories.categories);
    }

    const groupsData = await APIGetCustomFieldGroupsWhereMatch(
      'post_type',
      'is_equal',
      'post',
      loginPassword,
    );

    if (groupsData.status == 200) {
      const groupsParsed = JSON.parse(groupsData.data.getCustomFieldGroupsWhereMatch);
      setGroups(groupsParsed);
    }
  };

  const fetchImageData = async () => {
    const data = await APIGetFileById(featuredImageId);
    if (data.status == 200) {
      setFeaturedImage(data.data.getMediaFileById);
    }
  };

  const fetchImageDataSocial = async () => {
    const data = await APIGetFileById(postSocialImageId);
    if (data.status == 200) {
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
      'post',
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

      navigate(`/admin/posts/edit/${postId}`);
      return;
    }
    notify('Failed to create post.', 'error');
  };

  const submitScheduled = async () => {
    if (title == '') {
      notify('Failed to create page, requires a title.', 'error');
      return;
    }
    const data = await APISaveScheduledNewPost(
      loginPassword,
      title,
      content,
      featuredImageId,
      categoriesSelectedIds,
      tagsSelectedIds,
      'post',
      publishDate,
    );
    if (data.status == 200) {
      notify('Successfully created post.', 'success');
      const postId = data.data.createScheduledNewPost.post_id;

      const formattedFields = Object.entries(fieldValues).map(([groupId, fields]) => ({
        group_id: groupId,
        fields: fields,
      }));

      await APIUpdatePostCustomFieldData(formattedFields, postId, loginPassword);
      seo.socialImageId = postSocialImageId;
      const seoData = JSON.stringify(seo);
      await APIUpdatePostSEO(loginPassword, seoData, postId);

      navigate(`/admin/posts/edit/${postId}`);
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
      'post',
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

      navigate(`/admin/posts/edit/${postId}`);
      return;
    }
    notify('Failed to create post.', 'error');
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (postSocialImageId != null) {
      fetchImageDataSocial();
    }
  }, [postSocialImageId]);

  useEffect(() => {
    if (featuredImageId != null) {
      fetchImageData();
    }
  }, [featuredImageId]);

  return (
    <>
      <div className="w-full flex flex-col md:flex-row">
        <div className="w-full md:w-3/4 md:mr-4">
          <TitleBar />

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
            submitScheduled={submitScheduled}
            content={content}
            featuredImage={featuredImage}
            title={title}
            categories={categories}
            publishDateEdit={publishDateEdit}
            setPublishDateEdit={setPublishDateEdit}
            publishDate={publishDate}
            setPublishDate={setPublishDate}
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

export default PostsAddPageContent;
