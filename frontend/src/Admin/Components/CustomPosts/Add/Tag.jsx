import React from 'react';

const Tag = ({ tags, tagsSelectedIds, toggleTagCheckbox }) => {
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
    </div>
  );
};

export default Tag;
