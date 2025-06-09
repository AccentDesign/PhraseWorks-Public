import React, { useContext } from 'react';
import { APIConnectorContext } from '../../../../Contexts/APIConnectorContext';
import { notify } from '../../../../Utils/Notification';
import { APIAddPostTags } from '../../../../API/APIPosts';

const Tag = ({ tags, tagsSelectedIds, toggleTagCheckbox, postId, setReloadPost }) => {
  const { loginPassword } = useContext(APIConnectorContext);

  const addTags = async () => {
    const data = await APIAddPostTags(loginPassword, tagsSelectedIds, postId);
    if (data.status == 200) {
      if (data.data.updatePostTags.success == true) {
        setReloadPost(true);
        notify(`Successfully updated page tags`, `success`);
        return;
      }
    }
    notify(`Failed to update page tags`, `error`);
  };

  return (
    <div className="panel mt-8">
      <h3 className="font-bold text-lg">Tags</h3>
      <hr className="my-4" />
      <div className="flex flex-col gap-2 items-start mt-4 rounded  border border-gray-300">
        <ul className="py-4">
          {tags.map((tag, idx) => (
            <li key={idx} className="ml-2 flex flex-row items-center gap-4">
              <input
                id="default-checkbox"
                type="checkbox"
                value={tag.term_id}
                checked={tagsSelectedIds.includes(tag.term_id)}
                onChange={() => toggleTagCheckbox(tag.term_id)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
              />
              <p>{tag.name}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-row justify-start">
        <button type="button" className="mt-4 secondary-btn " onClick={() => addTags()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 mr-2"
          >
            <path
              fillRule="evenodd"
              d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
              clipRule="evenodd"
            />
          </svg>
          Update Tags
        </button>
      </div>
    </div>
  );
};

export default Tag;
