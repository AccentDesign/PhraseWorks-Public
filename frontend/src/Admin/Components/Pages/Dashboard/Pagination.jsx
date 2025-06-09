import React from 'react';

const Pagination = ({ totalPages, page, perPage, setPage }) => {
  const goToFirstPage = async () => {
    setPage(1);
  };
  const goToPrevPage = async () => {
    setPage(page - 1);
  };
  const goToNextPage = async () => {
    setPage(page + 1);
  };
  const goToLastPage = async () => {
    setPage(Math.ceil(totalPages / perPage));
  };
  return (
    <div className="flex flex-rows justify-end items-center px-4 py-8">
      <p className="mr-4">{totalPages} items</p>
      <div className="flex items-center space-x-2">
        <button
          className={`px-3 py-2 font-medium rounded shadow ${
            page == 1
              ? 'bg-gray-50 text-gray-200 cursor-not-allowed'
              : 'text-gray-800 bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => {
            if (page >= 2) {
              goToFirstPage();
            }
          }}
        >
          &laquo;
        </button>
        <button
          className={`px-3 py-2 font-medium rounded shadow ${
            page == 1
              ? 'bg-gray-50 text-gray-200 cursor-not-allowed'
              : 'text-gray-800 bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => {
            if (page >= 2) {
              goToPrevPage();
            }
          }}
        >
          &lsaquo;
        </button>
        <p>
          {page} of {Math.ceil(totalPages / perPage)}
        </p>
        <button
          className={`px-3 py-2 font-medium rounded shadow ${
            page == Math.ceil(totalPages / perPage)
              ? 'bg-gray-50 text-gray-200 cursor-not-allowed'
              : 'text-gray-800 bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => {
            if (page !== Math.ceil(totalPages / perPage)) {
              goToNextPage();
            }
          }}
        >
          &rsaquo;
        </button>
        <button
          className={`px-3 py-2 font-medium rounded shadow ${
            page == Math.ceil(totalPages / perPage)
              ? 'bg-gray-50 text-gray-200 cursor-not-allowed'
              : 'text-gray-800 bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => {
            if (page !== Math.ceil(totalPages / perPage)) {
              goToLastPage();
            }
          }}
        >
          &raquo;
        </button>
      </div>
    </div>
  );
};

export default Pagination;
