import React, { useContext, useEffect, useState } from 'react';
import { get_post_by, get_post_categories, get_post_tags } from '../../../Includes/Functions';
import TitleBar from './Edit/TitleBar';
import Title from './Edit/Title';
import Content from './Edit/Content';
import Status from './Edit/Status';
import FeaturedImage from './Edit/FeaturedImage';
import Category from './Edit/Category';
import Tag from './Edit/Tag';
import { useNavigate } from 'react-router-dom';
import { APIGetFileById } from '../../../API/APIMedia';
import { APIConnectorContext } from '../../../Contexts/APIConnectorContext';
import { APIGetCategories, APIUpdatePost } from '../../../API/APIPosts';
import { notify } from '../../../Utils/Notification';
import Template from './Edit/Template';
import { APIGetPageTemplates } from '../../../API/APIPageTemplates';
import CustomFields from './Edit/CustomFields';
import {
  APIGetCustomFieldGroupsWhereMatch,
  APIGetPostCustomFieldData,
  APIUpdatePostCustomFieldData,
} from '../../../API/APICustomFields';
import SEO from './Edit/SEO';
import Chevrons from '../Chevrons';

const PostsEditPageContent = ({ id, p }) => {
  const { loginPassword } = useContext(APIConnectorContext);
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [reloadPost, setReloadPost] = useState(false);
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
  const [reloadMedia, setReloadMedia] = useState(false);
  const [groups, setGroups] = useState([]);
  const [fieldValues, setFieldValues] = useState({});
  const [contentExpanded, setContentExpanded] = useState(true);
  const [customExpanded, setCustomExpanded] = useState(false);

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

  const fetchImageData = async () => {
    const data = await APIGetFileById(featuredImageId);
    if (data.status == 200) {
      setFeaturedImage(data.data.getMediaFileById);
    }
  };

  const updatePost = async () => {
    const data = await APIUpdatePost(loginPassword, title, content, featuredImageId, post?.id);
    if (data.status == 200) {
      notify('Successfully updated page.', 'success');
    } else {
      notify('Failed to update page.', 'error');
      return;
    }
    const formattedFields = Object.entries(fieldValues).map(([groupId, fields]) => ({
      group_id: groupId,
      fields: fields,
    }));
    const saveFields = await APIUpdatePostCustomFieldData(formattedFields, post?.id, loginPassword);
  };

  const fetchData = async () => {
    const categoriesData = await APIGetCategories(loginPassword, 'category');
    if (categoriesData.status == 200) {
      setCategories(categoriesData.data.getCategories.categories);
    }
    const tagsData = await APIGetCategories(loginPassword, 'post_tag');
    if (tagsData.status == 200) {
      setTags(tagsData.data.getCategories.categories);
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

    const customFieldData = await APIGetPostCustomFieldData(id, loginPassword);
    if (customFieldData.status == 200) {
      const fieldsData = JSON.parse(customFieldData.data.getPostCustomFieldData);
      const converted = fieldsData.reduce((acc, group) => {
        acc[group.group_id] = group.fields;
        return acc;
      }, {});
      setFieldValues(converted);
    }
  };

  const fetchPostData = async () => {
    if (reloadPost) {
      p = await get_post_by('id', id);
    }
    if (p?.post_title) {
      setPost(p);
      setTitle(p.post_title);
      setContent(p.post_content);
      setFeaturedImageId(p.featured_image_id);
      if (p.template_id !== null && p.template_id !== undefined) {
        setTemplateId(p.template_id);
      }
    }

    const categoryData = await get_post_categories(id);
    const categoriesTmp = [];
    for (const cat of categoryData) {
      categoriesTmp.push(cat.term_id);
    }
    setCategoriesSelectedIds(categoriesTmp);

    const tagData = await get_post_tags(id);
    const tagsTmp = [];
    for (const tag of tagData) {
      tagsTmp.push(tag.term_id);
    }
    setTagsSelectedIds(tagsTmp);

    const templatesData = await APIGetPageTemplates(loginPassword, 1, 9999, 'page');
    if (templatesData.status == 200) {
      setTemplates(templatesData.data.getPageTemplates.templates);
    }
  };

  useEffect(() => {
    fetchData();
    fetchPostData();
  }, [p]);

  useEffect(() => {
    if (featuredImageId != null) {
      fetchImageData();
    }
  }, [featuredImageId]);

  useEffect(() => {
    if (reloadPost == true) {
      fetchPostData();
      setReloadPost(false);
    }
  }, [reloadPost]);

  return (
    <div className="w-full flex flex-col md:flex-row">
      <div className="w-full md:w-3/4 md:mr-4">
        <TitleBar post={post} />

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
                post={post}
                groups={groups}
                fieldValues={fieldValues}
                setFieldValues={setFieldValues}
              />
            </div>
          )}
        </div>
        <SEO post={post} />
      </div>
      <div className="w-full md:w-1/4 md:ml-4">
        <Status
          updatePost={updatePost}
          post={post}
          setReloadPost={setReloadPost}
          content={content}
          featuredImage={featuredImage}
          title={title}
          categories={categories}
        />
        <Template
          templates={templates}
          postId={post?.id}
          templateId={templateId}
          setTemplateId={setTemplateId}
          setReloadPost={setReloadPost}
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
          postId={post?.id}
          setReloadPost={setReloadPost}
        />

        <Tag
          tags={tags}
          tagsSelectedIds={tagsSelectedIds}
          toggleTagCheckbox={toggleTagCheckbox}
          postId={post?.id}
          setReloadPost={setReloadPost}
        />
      </div>
    </div>
  );
};

export default PostsEditPageContent;
