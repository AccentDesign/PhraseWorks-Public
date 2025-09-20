import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { get_post_by, get_post_categories, get_post_tags } from '../../../Includes/Functions';
import TitleBar from './Edit/TitleBar';
import Title from './Edit/Title';
import Content from './Edit/Content';
import Status from './Edit/Status';
import FeaturedImage from './Edit/FeaturedImage';
import Category from './Edit/Category';
import Tag from './Edit/Tag';
import { APIGetFileById } from '../../../API/APIMedia';
import { APIConnectorContext } from '../../../Contexts/APIConnectorContext';
import { APIGetCategories, APIUpdatePost } from '../../../API/APIPosts';
import { notify } from '../../../Utils/Notification';
import CustomFields from './Edit/CustomFields';
import {
  APIGetCustomFieldGroupsWhereMatch,
  APIGetPostCustomFieldData,
  APIUpdatePostCustomFieldData,
} from '../../../API/APICustomFields';
import SEO from './Edit/SEO';
import { APIGetCustomPostBySlug } from '../../../API/APICustomPosts';
import Chevrons from '../Chevrons';

const CustomPostEditPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const { postType, id } = useParams();
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
  const [reloadMedia, setReloadMedia] = useState(false);
  const [groups, setGroups] = useState([]);
  const [fieldValues, setFieldValues] = useState({});
  const [contentExpanded, setContentExpanded] = useState(true);
  const [customExpanded, setCustomExpanded] = useState(false);
  const [customPostName, setCustomPostName] = useState('');

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

  const fetchImageData = async (isMounted = true) => {
    const data = await APIGetFileById(featuredImageId);
    if (isMounted && data.status == 200) {
      setFeaturedImage(data.data.getMediaFileById);
    }
  };

  const updatePost = async () => {
    const data = await APIUpdatePost(loginPassword, title, content, featuredImageId, post?.id);
    if (data.status == 200) {
      notify('Successfully updated post.', 'success');
    } else {
      notify('Failed to update post.', 'error');
      return;
    }
    const formattedFields = Object.entries(fieldValues).map(([groupId, fields]) => ({
      group_id: groupId,
      fields: fields,
    }));

    await APIUpdatePostCustomFieldData(formattedFields, post?.id, loginPassword);
  };

  const fetchData = async (isMounted = true) => {
    const postTypePost = await APIGetCustomPostBySlug(postType, loginPassword);
    if (isMounted && postTypePost.status == 200) {
      const post = JSON.parse(postTypePost.data.getCustomPostBySlug);
      setCustomPostName(post.name);
    }
    const categoriesData = await APIGetCategories(loginPassword, 'category');
    if (isMounted && categoriesData.status == 200) {
      setCategories(categoriesData.data.getCategories.categories);
    }
    const tagsData = await APIGetCategories(loginPassword, 'post_tag');
    if (isMounted && tagsData.status == 200) {
      setTags(tagsData.data.getCategories.categories);
    }
  };

  const fetchPostData = async (isMounted = true) => {
    const data = await get_post_by('id', id);
    if (isMounted && data != null) {
      setPost(data);
      setTitle(data.post_title);
      setContent(data.post_content);
      setFeaturedImageId(data.featured_image_id);
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

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      await fetchData(isMounted);
      await fetchPostData(isMounted);
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (featuredImageId != null) {
      fetchImageData(isMounted);
    }

    return () => {
      isMounted = false;
    };
  }, [featuredImageId]);

  useEffect(() => {
    let isMounted = true;

    if (reloadPost === true) {
      setReloadPost(false);
      fetchPostData(isMounted);
    }

    return () => {
      isMounted = false;
    };
  }, [reloadPost]);

  return (
    <div className="w-full flex flex-col md:flex-row">
      <div className="w-full md:w-3/4 md:mr-4">
        <TitleBar post={post} customPostName={customPostName} />

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

export default CustomPostEditPageContent;
