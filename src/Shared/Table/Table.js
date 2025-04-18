import React, { useState } from 'react';
import { FaEdit, FaTrash, FaArrowLeft, FaArrowRight, FaSearch, FaPlus } from 'react-icons/fa';
import './styles.css';
import { useNavigate } from "react-router-dom";

const TableComponent = ({ data, columns, onEdit, onDelete, filterData, onAdd, showAdd = true }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredData = filterData ? filterData(data, searchTerm) : data;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleCreateNew = () => {
    navigate('/create/personal');
  };

  return (
    <div className="table-wrapper">
      <div className="controls-container">
        <div className="left-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button">
              <FaSearch size={14} />
            </button>
          </div>

          <div className="items-per-page">
            <label>Số hàng hiển thị:</label>
            <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <button className="create-new-btn" onClick={handleCreateNew}>
          <FaPlus size={14} />
          Tạo mới
        </button>
      </div>

      <div className="scrollable-table">
        <table className="table">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column.label}</th>
              ))}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr key={index}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex}>
                    {column.type === 'checkbox' ? (
                      <input
                        type="checkbox"
                        checked={item[column.key] || false}
                        readOnly
                      />
                    ) : (
                      item[column.key]
                    )}
                  </td>
                ))}
                <td>
                  <div className="action-buttons">
                    <button onClick={() => onEdit(item)} className="btn btn-edit">
                      <FaEdit />
                    </button>
                    <button onClick={() => onDelete(item)} className="btn btn-delete">
                      <FaTrash />
                    </button>
                    {showAdd && (
                      <button onClick={() => onAdd(item)} className="btn btn-add">
                        <FaPlus />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn arrow"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FaArrowLeft size={14} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="pagination-btn arrow"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <FaArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TableComponent;