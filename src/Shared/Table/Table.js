import React, { useState } from 'react';
import { FaEdit, FaTrash, FaArrowLeft, FaArrowRight, FaSearch, FaPlus, FaEye } from 'react-icons/fa';
import './styles.css';

const TableComponent = ({
  data,
  columns,
  onEdit,
  onDelete,
  filterData,
  onAdd,
  onView,
  showView = true,
  showAdd = true,
  showCreate = true,
  onCreate,
  groupBy,
  onBranchShow = true,
  onDepartmentShow = true,
  sortField,
  canCreate = true,
  canUpdate = true,
  canDelete = true,
  canView = true,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc'); // State for sort order: 'asc' or 'desc'

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

  // Sort data based on sortField and sortOrder
  const sortedData = sortField
    ? [...filteredData].sort((a, b) => {
        const valueA = a[sortField];
        const valueB = b[sortField];

        // Handle different data types for sorting
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return sortOrder === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        } else {
          return sortOrder === 'asc'
            ? valueA - valueB || 0
            : valueB - valueA || 0;
        }
      })
    : filteredData;

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Reset department to 'All' when branch changes
  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
    setSelectedDepartment('All'); // Reset department filter
    setCurrentPage(1); // Reset to first page
  };

  // Handle sort order change
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1); // Reset to first page when sort changes
  };

  return (
    <div className="table-wrapper">
      <div className="controls-container">
        <div className="left-controls">
          <div className="search-container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button">
              <FaSearch size={14} />
            </button>
          </div>

          {/* Branch Filter - Chỉ hiển thị nếu onBranchShow là true */}
          {onBranchShow && (
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
          )}

          {/* Department Filter - Chỉ hiển thị nếu onDepartmentShow là true */}
          {onDepartmentShow && (
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
          )}

          <div className="items-per-page" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label>Số hàng hiển thị:</label>
            <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Sort Combobox - Moved after items-per-page */}
          {sortField && (
            <div className="sort-filter" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label htmlFor="sort-select" style={{ fontSize: '14px' }}>Sắp xếp: </label>
              <select
                id="sort-select"
                value={sortOrder}
                onChange={handleSortChange}
                style={{ padding: '6px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="asc">Cao → Thấp</option>
                <option value="desc">Thấp → Cao</option>
              </select>
            </div>
          )}
        </div>
        {showCreate && (
          <button
            className="create-new-btn"
            onClick={onCreate}
            disabled={!canCreate}
            style={{
              opacity: canCreate ? 1 : 0.5,
              cursor: canCreate ? 'pointer' : 'not-allowed',
            }}
          >
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
                <th>Thao tác</th>
              </tr>
            )}
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
              <th>Thao tác</th>
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
                    ) : column.render ? (
                      column.render(item[column.key], item)
                    ) : (
                      item[column.key]
                    )}
                  </td>
                ))}
                <td>
                  <div className="action-buttons">
                    {showView && (
                      <button
                        onClick={() => onView(item)}
                        className="btn btn-view"
                        disabled={!canView}
                        style={{
                          opacity: canView ? 1 : 0.5,
                          cursor: canView ? 'pointer' : 'not-allowed',
                        }}
                      >
                        <FaEye />
                      </button>
                    )}
                    {showAdd && (
                      <button
                        onClick={() => onAdd(item)}
                        className="btn btn-add"
                        disabled={!canCreate} // Assuming "Add" requires create permission
                        style={{
                          opacity: canCreate ? 1 : 0.5,
                          cursor: canCreate ? 'pointer' : 'not-allowed',
                        }}
                      >
                        <FaPlus />
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(item)}
                      className="btn btn-edit"
                      disabled={!canUpdate}
                      style={{
                        opacity: canUpdate ? 1 : 0.5,
                        cursor: canUpdate ? 'pointer' : 'not-allowed',
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      className="btn btn-delete"
                      disabled={!canDelete}
                      style={{
                        opacity: canDelete ? 1 : 0.5,
                        cursor: canDelete ? 'pointer' : 'not-allowed',
                      }}
                    >
                      <FaTrash />
                    </button>
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