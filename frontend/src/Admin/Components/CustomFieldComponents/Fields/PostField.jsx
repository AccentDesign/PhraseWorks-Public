import React, { useContext, useEffect, useState } from 'react';
import { APIAllGetPosts } from '../../../../API/APIPosts';
import { APIConnectorContext } from '../../../../Contexts/APIConnectorContext';

const PostField = ({ type, value, setValue, label, name, defaultValue, args }) => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      const allData = await APIAllGetPosts(
        loginPassword,
        1,
        2147483,
        args.postType != undefined && args.postType != '' ? args.postType : 'post',
      );
      if (isMounted && allData.status == 200) {
        setPosts(allData.data.getPosts.posts);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="w-full mb-4">
      <label className="block">{label}</label>
      <select
        id={name}
        className="bg-gray-100 border-gray-300 border px-4 py-2 divide-y divide-gray-100 rounded shadow"
        value={value}
        onChange={setValue}
      >
        <option value="">Please select...</option>
        {posts.map((choice) => (
          <option key={choice.id} value={choice.id}>
            {choice.post_title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PostField;
