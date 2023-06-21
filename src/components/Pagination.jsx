import React from "react";
import "../styles/Pagination.css";

const Pagination = ({
  currentPage,
  itemsPerPage,
  totalItems,
  paginate,
  changeItemsPerPage,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <ul className="pagination">
      <select
        value={itemsPerPage}
        onChange={(e) => changeItemsPerPage(e.target.value)}
      >
        <option value={3}>3</option>
        <option value={5}>5</option>
        <option value={10}>10</option>
      </select>
      {currentPage > 1 && (
        <li>
          <button onClick={() => paginate(currentPage - 1)}>Prev</button>
        </li>
      )}

      {pageNumbers.map((number) => (
        <li key={number}>
          <button
            onClick={() => paginate(number)}
            className={number === currentPage ? "active" : ""}
          >
            {number}
          </button>
        </li>
      ))}

      {currentPage < pageNumbers.length && (
        <li>
          <button onClick={() => paginate(currentPage + 1)}>Next</button>
        </li>
      )}
    </ul>
  );
};

export default Pagination;
