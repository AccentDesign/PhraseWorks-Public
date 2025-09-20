import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TitleBar from './CustomPostsNew/TitleBar';
import { v4 as uuidv4 } from 'uuid';
import { APIConnectorContext } from '../../../Contexts/APIConnectorContext';
import { notify } from '../../../Utils/Notification';
import { APIGetCustomPosts, APIUpdateCustomPosts } from '../../../API/APICustomPosts';
import { APILogError } from '../../../API/APISystem';

const CustomPostsNewPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);

  const normalizePostTypeName = (name) => {
    return name
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '_')
      .toLowerCase();
  };

  const triggerSave = async () => {
    if (name === '') {
      notify(`Field group 'Name' required.`, 'error');
      return;
    }
    const id = uuidv4();
    const post = {
      id,
      name,
      description,
      active,
    };
    const groupsData = await APIGetCustomPosts(loginPassword);
    if (groupsData.status !== 200) {
      notify(`Error saving group.`, 'error');
      return;
    }
    let posts = [];
    try {
      posts = JSON.parse(groupsData.data.getCustomPosts);
      if (!Array.isArray(posts)) posts = [];
    } catch (err) {
      await APILogError(err.stack || String(err));
      notify(`Error parsing posts.`, 'error');
      return;
    }
    posts.push(post);
    const saveData = await APIUpdateCustomPosts(posts, loginPassword);
    if (saveData.status !== 200) {
      notify(`Error saving custom post.`, 'error');
      return;
    } else {
      notify(`Success saving custom post.`, 'success');
      navigate(`/admin/settings/custom_posts`);
    }
  };
  return (
    <>
      <div className="w-full">
        <TitleBar name={name} setName={setName} triggerSave={triggerSave} />
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

export default CustomPostsNewPageContent;
