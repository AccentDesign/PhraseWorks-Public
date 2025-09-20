import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { parse, v4 as uuidv4 } from 'uuid';
import TitleBar from './CustomPostsEdit/TitleBar';
import { APIConnectorContext } from '../../../Contexts/APIConnectorContext';
import { notify } from '../../../Utils/Notification';
import {
  APIGetCustomPostById,
  APIGetCustomPosts,
  APIUpdateCustomPosts,
} from '../../../API/APICustomPosts';
import { APILogError } from '../../../API/APISystem';

const CustomFieldsGroupsEditPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);

  const triggerSave = async () => {
    if (name === '') {
      notify(`Field group 'Name' required.`, 'error');
      return;
    }
    const postsData = await APIGetCustomPosts(loginPassword);
    if (postsData.status !== 200) {
      notify(`Error saving group.`, 'error');
      return;
    }
    let posts = [];
    try {
      posts = JSON.parse(postsData.data.getCustomPosts);
      if (!Array.isArray(posts)) posts = [];
    } catch (err) {
      await APILogError(err.stack || String(err));
      notify(`Error parsing groups.`, 'error');
      return;
    }
    const index = posts.findIndex((g) => g.id === id);
    const post = {
      id,
      name,
      description,
      active,
    };
    if (index !== -1) {
      posts[index] = post;
    } else {
      posts.push(post);
    }
    const saveData = await APIUpdateCustomPosts(posts, loginPassword);
    if (saveData.status !== 200) {
      notify(`Error saving custom post.`, 'error');
      return;
    } else {
      notify(`Success saving custom post.`, 'success');
      navigate(`/admin/settings/custom_posts`);
    }
  };

  const normalizePostTypeName = (name) => {
    return name
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '_')
      .toLowerCase();
  };

  const fetchData = async () => {
    const data = await APIGetCustomPostById(id, loginPassword);
    if (data.status == 200) {
      const parsedData = JSON.parse(data.data.getCustomPostById);
      setName(parsedData.name);
      setDescription(parsedData.description);
      setActive(parsedData.active);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="w-full">
        <TitleBar triggerSave={triggerSave} />
        <div className="panel mt-4">
          <div className="mb-4">
            <p>Post Type Name</p>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
          </div>
          <div className="mb-4">
            <p>Database Slug</p>
            <input
              type="text"
              name="slug"
              placeholder="Slug"
              value={normalizePostTypeName(name)}
              className="border border-gray-300 rounded-lg block w-full p-2.5 cursor-not-allowed bg-white text-gray-400"
              disabled
            />
          </div>
          <div className="w-full mb-4">
            <label>Description</label>
            <textarea
              name={name}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full p-2 bg-gray-50 border rounded resize-y"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomFieldsGroupsEditPageContent;
