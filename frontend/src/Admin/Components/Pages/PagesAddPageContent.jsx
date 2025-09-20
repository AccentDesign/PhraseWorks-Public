import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIConnectorContext } from '../../../Contexts/APIConnectorContext.jsx';
import TitleBar from './Add/TitleBar';
import {
  APIGetCategories,
  APISaveDraftNewPage,
  APISavePublishNewPage,
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
import { APIGetPageTemplates, APIUpdatePageTemplateId } from '../../../API/APIPageTemplates.js';
import Template from './Add/Template.jsx';
import {
  APIGetCustomFieldGroupsWhereMatch,
  APIUpdatePostCustomFieldData,
} from '../../../API/APICustomFields.js';
import CustomFields from './Add/CustomFields.jsx';
import PluginComponents from '../../Utils/PluginComponents.jsx';
import SEO from './Add/SEO.jsx';
import Chevrons from '../Chevrons.jsx';

const PostsAddPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState('');
  const [featuredImageId, setFeaturedImageId] = useState(null);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [activeContentTab, setActiveContentTab] = useState('visual');
  const [content, setContent] = useState('');
  const [categoriesSelectedIds, setCategoriesSelectedIds] = useState([]);
  const [tagsSelectedIds, setTagsSelectedIds] = useState([]);
  const [templateId, setTemplateId] = useState(-1);
  const [templates, setTemplates] = useState([]);
  const [reloadMedia, setReloadMedia] = useState(false);
  const [groups, setGroups] = useState([]);
  const [fieldValues, setFieldValues] = useState({});
  const [contentExpanded, setContentExpanded] = useState(true);
  const [customExpanded, setCustomExpanded] = useState(false);
  const [pageSocialImageId, setPageSocialImageId] = useState(null);
  const [pageSocialImage, setPageSocialImage] = useState('');

  const [seo, setSEO] = useState({
    title: '',
    description: '',
    ogTitle: '',
    ogDescription: '',
    ogUrl: '',
    ogSiteName: '',
    socialImageId: null,
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

    const templatesData = await APIGetPageTemplates(loginPassword, 1, 9999, 'page');
    if (templatesData.status == 200) {
      setTemplates(templatesData.data.getPageTemplates.templates);
    }

    const groupsData = await APIGetCustomFieldGroupsWhereMatch(
      'post_type',
      'is_equal',
      'page',
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
    const data = await APIGetFileById(pageSocialImageId);
    if (data.status == 200) {
      setPageSocialImage(data.data.getMediaFileById);
    }
  };

  const submitDraft = async () => {
    if (title == '') {
      notify('Failed to create page, requires a title.', 'error');
      return;
    }
    const data = await APISaveDraftNewPage(
      loginPassword,
      title,
      content,
      featuredImageId,
      categoriesSelectedIds,
      tagsSelectedIds,
    );
    if (data.status == 200) {
      notify('Successfully created page.', 'success');
      const postId = data.data.createDraftNewPage.post_id;
      if (templateId != -1) {
        await APIUpdatePageTemplateId(loginPassword, templateId, postId);
      }

      const formattedFields = Object.entries(fieldValues).map(([groupId, fields]) => ({
        group_id: groupId,
        fields: fields,
      }));

      await APIUpdatePostCustomFieldData(formattedFields, postId, loginPassword);
      seo.socialImageId = pageSocialImageId;
      const seoData = JSON.stringify(seo);
      await APIUpdatePostSEO(loginPassword, seoData, postId);

      navigate(`/admin/pages/edit/${postId}`);
      return;
    }
    notify('Failed to create page.', 'error');
  };

  const submitPublish = async () => {
    if (title == '') {
      notify('Failed to create page, requires a title.', 'error');
      return;
    }
    const data = await APISavePublishNewPage(
      loginPassword,
      title,
      content,
      featuredImageId,
      categoriesSelectedIds,
      tagsSelectedIds,
    );
    if (data.status == 200) {
      notify('Successfully created page.', 'success');
      const postId = data.data.createPublishNewPage.post_id;
      if (templateId != -1) {
        await APIUpdatePageTemplateId(loginPassword, templateId, postId);
      }

      const formattedFields = Object.entries(fieldValues).map(([groupId, fields]) => ({
        group_id: groupId,
        fields: fields,
      }));
      await APIUpdatePostCustomFieldData(formattedFields, postId, loginPassword);

      seo.socialImageId = pageSocialImageId;
      const seoData = JSON.stringify(seo);
      await APIUpdatePostSEO(loginPassword, seoData, postId);

      navigate(`/admin/pages/edit/${postId}`);
      return;
    }
    notify('Failed to create page.', 'error');
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (pageSocialImageId != null) {
      fetchImageDataSocial();
    }
  }, [pageSocialImageId]);

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
          <div className="panel-no-pad mt-8">
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
            setPageSocialImageId={setPageSocialImageId}
            setPageSocialImage={setPageSocialImage}
            pageSocialImage={pageSocialImage}
            pageSocialImageId={pageSocialImageId}
          />
          <PluginComponents page="add_page" loginPassword={loginPassword} />
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

          <Template templates={templates} templateId={templateId} setTemplateId={setTemplateId} />

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
