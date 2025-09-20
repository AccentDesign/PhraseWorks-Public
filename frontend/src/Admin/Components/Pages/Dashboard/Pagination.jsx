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
    <div className="pagination-block">
      <p className="mr-4">{totalPages} items</p>
      <div className="pagination-buttons">
        <button
          className={`pagination-btn ${
            page == 1 ? 'pagination-btn-disabled' : 'pagination-btn-enabled'
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
          className={`pagination-btn ${
            page == 1 ? 'pagination-btn-disabled' : 'pagination-btn-enabled'
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
          className={`pagination-btn ${
            page == Math.ceil(totalPages / perPage)
              ? 'pagination-btn-disabled'
              : 'pagination-btn-enabled'
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
          className={`pagination-btn ${
            page == Math.ceil(totalPages / perPage)
              ? 'pagination-btn-disabled'
              : 'pagination-btn-enabled'
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
