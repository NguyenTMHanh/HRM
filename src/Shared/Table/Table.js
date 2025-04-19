import React, { useState } from 'react';
import { FaEdit, FaTrash, FaArrowLeft, FaArrowRight, FaSearch, FaPlus } from 'react-icons/fa';
import './styles.css';
import { useNavigate } from 'react-router-dom';

const TableComponent = ({ data, columns, onEdit, onDelete, filterData, onAdd, showAdd = true, showCreate=true, groupBy }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const navigate = useNavigate();

  // Get unique branches
  const uniqueBranches = [...new Set(data.map(item => item.branch))];

  // Get unique departments filtered by selected branch
  const uniqueDepartments = selectedBranch === 'All'
    ? [...new Set(data.map(item => item.department))]
    : [...new Set(data.filter(item => item.branch === selectedBranch).map(item => item.department))];

  // Filter data by branch
  const branchFilteredData = selectedBranch === 'All'
    ? data
    : data.filter(item => item.branch === selectedBranch);

  // Filter data by department
  const departmentFilteredData = selectedDepartment === 'All'
    ? branchFilteredData
    : branchFilteredData.filter(item => item.department === selectedDepartment);

  // Apply search filter
  const filteredData = filterData ? filterData(departmentFilteredData, searchTerm) : departmentFilteredData;

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

  // Reset department to 'All' when branch changes
  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
    setSelectedDepartment('All'); // Reset department filter
    setCurrentPage(1); // Reset to first page
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

          {/* Branch Filter */}
          <div className="branch-filter" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label htmlFor="branch-select" style={{ fontSize: '14px' }}>Chi nhánh: </label>
            <select
              id="branch-select"
              value={selectedBranch}
              onChange={handleBranchChange}
              style={{ padding: '6px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="All">Tất cả</option>
              {uniqueBranches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div className="department-filter" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label htmlFor="department-select" style={{ fontSize: '14px' }}>Bộ phận: </label>
            <select
              id="department-select"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              style={{ padding: '6px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="All">Tất cả</option>
              {uniqueDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
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
        {showCreate && (
                  <button className="create-new-btn" onClick={handleCreateNew}>
                  <FaPlus size={14} />
                  Tạo mới
                </button>
        )}
      </div>

      <div className="scrollable-table">
        <table className="table">
          <thead>
            {groupBy && (
              <tr>
                {groupBy.map((group, index) => (
                  <th key={index} colSpan={group.columns.length} className="group-header">
                    {group.label}
                  </th>
                ))}
                <th>Action</th>
              </tr>
            )}
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr key={item.employeeId || index}>
                {columns.map((column) => (
                  <td key={column.key}>
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