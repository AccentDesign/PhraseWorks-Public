import React from 'react';

const FiltersFields = ({
  filterSearch,
  setFilterSearch,
  filterPostType,
  setFilterPostType,
  filterTaxonomy,
  setFilterTaxonomy,
}) => {
  return (
    <div className="mb-4">
      <div className="flex items-center">
        <input
          id="default-search"
          type="checkbox"
          value=""
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm"
          checked={filterSearch}
          onChange={(e) => setFilterSearch(e.target.checked)}
        />
        <p className="ms-2 text-sm font-medium text-gray-900">Search</p>
      </div>
      <div className="flex items-center">
        <input
          id="checked-post_type"
          type="checkbox"
          value=""
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm"
          checked={filterPostType}
          onChange={(e) => setFilterPostType(e.target.checked)}
        />
        <p className="ms-2 text-sm font-medium text-gray-900">Post Type</p>
      </div>
      <div className="flex items-center">
        <input
          id="checked-taxonomy"
          type="checkbox"
          value=""
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm"
          checked={filterTaxonomy}
          onChange={(e) => setFilterTaxonomy(e.target.checked)}
        />
        <p className="ms-2 text-sm font-medium text-gray-900">Taxonomy</p>
      </div>
    </div>
  );
};

export default FiltersFields;
