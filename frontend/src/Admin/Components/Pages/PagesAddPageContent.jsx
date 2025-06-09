import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIConnectorContext } from '../../../Contexts/APIConnectorContext.jsx';
import TitleBar from './Add/TitleBar';
import {
  APIGetCategories,
  APISaveDraftNewPage,
  APISavePublishNewPage,
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
  const [templateId, setTemplateId] = useState(-1);
  const [templates, setTemplates] = useState([]);

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
  };

  const fetchImageData = async () => {
    const data = await APIGetFileById(loginPassword, featuredImageId);
    if (data.status == 200) {
      setFeaturedImage(data.data.getMediaFileById);
    }
  };

  const submitDraft = async () => {
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

      navigate(`/admin/pages/edit/${postId}`);
      return;
    }
    notify('Failed to create page.', 'error');
  };

  const submitPublish = async () => {
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
      navigate(`/admin/pages/edit/${postId}`);
      return;
    }
    notify('Failed to create page.', 'error');
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (featuredImageId != null) {
      console.log('featured image id changed');
      fetchImageData();
    }
  }, [featuredImageId]);

  return (
    <>
      <div className="w-full flex flex-col md:flex-row">
        <div className="w-full md:w-3/4 md:mr-4">
          <TitleBar />

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white w-full mt-8 p-4">
            <Title title={title} updateTitle={updateTitle} />
            <Content
              activeContentTab={activeContentTab}
              setActiveContentTab={setActiveContentTab}
              content={content}
              HandleContentEditorChange={HandleContentEditorChange}
              HandleContentChange={HandleContentChange}
            />
          </div>
        </div>
        <div className="w-full md:w-1/4 md:ml-4">
          <Status submitDraft={submitDraft} submitPublish={submitPublish} />

          <Template templates={templates} templateId={templateId} setTemplateId={setTemplateId} />

          <FeaturedImage featuredImage={featuredImage} setFeaturedImageId={setFeaturedImageId} />

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
