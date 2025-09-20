import React, { useContext, useEffect, useState, useRef } from 'react';
import { APIAllGetPosts, APIAllGetPostsSearch } from '../../../../API/APIPosts';
import { APIConnectorContext } from '../../../../Contexts/APIConnectorContext';
import { APILogError } from '../../../../API/APISystem';

const PageField = ({ type, value, setValue, label, name, defaultValue, args }) => {
  const { loginPassword } = useContext(APIConnectorContext);

  const [posts, setPosts] = useState([]);
  const [postType, setPostType] = useState('');
  const [search, setSearch] = useState('');
  const [selectedPosts, setSelectedPosts] = useState([]);

  const initialized = useRef(false);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      let allData;
      if (search === '') {
        allData = await APIAllGetPosts(loginPassword, 1, 2147483, postType);
        if (isMounted && allData.status === 200) {
          const fetchedPosts = allData.data.getPosts.posts;
          setPosts(fetchedPosts);
        }
      } else {
        allData = await APIAllGetPostsSearch(loginPassword, search, 1, 2147483647, postType);
        if (isMounted && allData.status === 200) {
          const fetchedPosts = allData.data.getPostsSearch.posts;
          setPosts(fetchedPosts);
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [search, postType]);

  useEffect(() => {
    const fetchData = async () => {
      if (!posts.length) return;
      if (initialized.current) return;

      if (!value || value === '') return;

      let valueIds = [];
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          valueIds = parsed;
        }
      } catch (err) {
        await APILogError(err.stack || String(err));
      }

      if (valueIds.length === 0) {
        initialized.current = true;
        return;
      }

      const matchedPosts = posts.filter((post) => valueIds.includes(post.id));
      setSelectedPosts(matchedPosts);
      initialized.current = true;
    };
    fetchData();
  }, [posts, value]);

  useEffect(() => {
    const fetchData = async () => {
      if (!initialized.current) return;

      let valueIdsSorted = [];
      if (value && value !== '') {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            valueIdsSorted = parsed.slice().sort((a, b) => a - b);
          }
        } catch (err) {
          await APILogError(err.stack || String(err));
        }
      }

      const selectedIdsSorted = [...selectedPosts.map((p) => p.id)].sort((a, b) => a - b);

      if (JSON.stringify(selectedIdsSorted) !== JSON.stringify(valueIdsSorted)) {
        setValue({
          target: {
            value: JSON.stringify(selectedIdsSorted),
          },
        });
      }
    };
    fetchData();
  }, [selectedPosts, setValue, value]);

  const groupPostsByType = (posts) => {
    const groups = {};

    posts.forEach((post) => {
      if (!groups[post.post_type]) {
        groups[post.post_type] = [];
      }
      groups[post.post_type].push(post);
    });

    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([type, posts]) => ({
        type,
        posts: posts.sort((a, b) =>
          (a.post_title || '').localeCompare(b.post_title || '', undefined, {
            sensitivity: 'base',
          }),
        ),
      }));
  };

  return (
    <div className="w-full mb-6">
      <label className="block font-semibold mb-2">{label}</label>

      <div className="flex items-center gap-4 bg-gray-100 px-4 py-4 border-t border-r border-l">
        <input
          type="text"
          name="search"
          placeholder="Search posts..."
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300 "
        />
        <select
          id="postType"
          className="px-3 py-2 border border-gray-300 rounded shadow-sm"
          value={postType}
          onChange={(e) => setPostType(e.target.value)}
        >
          <option value="">All types</option>
          <option value="post">Post</option>
          <option value="page">Page</option>
        </select>
      </div>

      <div className="border-l border-r border-b border-gray-200 rounded-b max-h-60 flex flex-row ">
        <div className="w-1/2 max-h-60 overflow-y-auto">
          {groupPostsByType(posts).length > 0 ? (
            groupPostsByType(posts).map((group) => (
              <div key={group.type} className="px-2 py-1">
                <div className="text-xs font-semibold bg-blue-200 text-gray-500 uppercase py-1 px-2">
                  {group.type}
                </div>
                {group.posts.map((post) => {
                  const isSelected = selectedPosts.some((p) => p.id === post.id);
                  return (
                    <button
                      key={post.id}
                      type="button"
                      onClick={() => {
                        setSelectedPosts((prev) => {
                          if (prev.some((p) => p.id === post.id)) return prev;
                          return [...prev, post];
                        });
                      }}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center bg-blue-50 hover:bg-blue-100 ${
                        isSelected ? 'bg-blue-100' : ''
                      }`}
                    >
                      <span className="text-gray-800">{post.post_title}</span>
                    </button>
                  );
                })}
              </div>
            ))
          ) : (
            <div className="p-4 text-sm text-gray-500">No posts found</div>
          )}
        </div>

        <div className="w-1/2 max-h-60 overflow-y-auto">
          {selectedPosts.map((post) => (
            <button
              key={post.id}
              type="button"
              onClick={() => {
                setSelectedPosts((prev) => prev.filter((p) => p.id !== post.id));
              }}
              className="w-full text-left px-4 py-2 text-sm flex items-center hover:bg-blue-50"
            >
              <span className="text-gray-800">{post.post_title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageField;
