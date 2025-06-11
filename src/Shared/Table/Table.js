import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaArrowLeft, FaArrowRight, FaSearch, FaPlus, FaEye } from 'react-icons/fa';
import { message } from 'antd';
import axios from 'axios';
import './styles.css';

// Axios configuration
axios.defaults.baseURL = "https://localhost:7239";
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
  branchFieldName = 'branch', // Field name for branch in data
  departmentFieldName = 'department', // Field name for department in data
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // API data states
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  // Fetch branches from API
  const fetchBranches = async () => {
    try {
      setLoadingBranches(true);
      const response = await axios.get('/api/Branch');
      
      if (response.data && Array.isArray(response.data)) {
        setBranches(response.data);
      } else {
        console.error('Invalid branches data format:', response.data);
        setBranches([]);
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
      message.error('Không thể tải danh sách chi nhánh');
      setBranches([]);
    } finally {
      setLoadingBranches(false);
    }
  };

  // Fetch departments from API
  const fetchDepartments = async () => {
    try {
      setLoadingDepartments(true);
      const response = await axios.get('/api/Department');
      
      if (response.data && Array.isArray(response.data)) {
        setDepartments(response.data);
      } else {
        console.error('Invalid departments data format:', response.data);
        setDepartments([]);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      message.error('Không thể tải danh sách bộ phận');
      setDepartments([]);
    } finally {
      setLoadingDepartments(false);
    }
  };

  // Load API data on component mount
  useEffect(() => {
    if (onBranchShow) {
      fetchBranches();
    }
    if (onDepartmentShow) {
      fetchDepartments();
    }
  }, [onBranchShow, onDepartmentShow]);

  // Get departments filtered by selected branch
  const getFilteredDepartments = () => {
    if (selectedBranch === 'All') {
      return departments;
    }
    
    // Find the selected branch
    const selectedBranchData = branches.find(branch => branch.branchName === selectedBranch);
    if (selectedBranchData && selectedBranchData.departmentName) {
      // Filter departments that exist in the selected branch
      return departments.filter(dept => 
        selectedBranchData.departmentName.includes(dept.departmentName)
      );
    }
    
    return departments;
  };

  const filteredDepartments = getFilteredDepartments();

  // Filter data by branch
  const branchFilteredData = selectedBranch === 'All'
    ? data
    : data.filter(item => item[branchFieldName] === selectedBranch);

  // Filter data by department
  const departmentFilteredData = selectedDepartment === 'All'
    ? branchFilteredData
    : branchFilteredData.filter(item => item[departmentFieldName] === selectedDepartment);

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

  // Handle branch change - reset department filter
  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
    setSelectedDepartment('All'); // Reset department filter
    setCurrentPage(1); // Reset to first page
  };

  // Handle department change
  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
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

          {/* Branch Filter - Load from API */}
          {onBranchShow && (
            <div className="branch-filter" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label htmlFor="branch-select" style={{ fontSize: '14px' }}>Chi nhánh: </label>
              <select
                id="branch-select"
                value={selectedBranch}
                onChange={handleBranchChange}
                disabled={loadingBranches}
                style={{ 
                  padding: '6px', 
                  fontSize: '14px', 
                  borderRadius: '4px', 
                  border: '1px solid #ccc',
                  opacity: loadingBranches ? 0.6 : 1
                }}
              >
                <option value="All">
                  {loadingBranches ? 'Đang tải...' : 'Tất cả'}
                </option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.branchName}>
                    {branch.branchName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Department Filter - Load from API and filter by branch */}
          {onDepartmentShow && (
            <div className="department-filter" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label htmlFor="department-select" style={{ fontSize: '14px' }}>Bộ phận: </label>
              <select
                id="department-select"
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                disabled={loadingDepartments}
                style={{ 
                  padding: '6px', 
                  fontSize: '14px', 
                  borderRadius: '4px', 
                  border: '1px solid #ccc',
                  opacity: loadingDepartments ? 0.6 : 1
                }}
              >
                <option value="All">
                  {loadingDepartments ? 'Đang tải...' : 'Tất cả'}
                </option>
                {filteredDepartments.map(dept => (
                  <option key={dept.id} value={dept.departmentName}>
                    {dept.departmentName}
                  </option>
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

          {/* Sort Combobox */}
          {sortField && (
            <div className="sort-filter" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label htmlFor="sort-select" style={{ fontSize: '14px' }}>Sắp xếp: </label>
              <select
                id="sort-select"
                value={sortOrder}
                onChange={handleSortChange}
                style={{ padding: '6px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="asc">A → Z</option>
                <option value="desc">Z → A</option>
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
            {currentData.length > 0 ? (
              currentData.map((item, index) => (
                <tr key={item.employeeId || item.id || index}>
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
                        item[column.key] || ''
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
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </button>
                      )}
                      {showAdd && onAdd && (
                        <button
                          onClick={() => onAdd(item)}
                          className="btn btn-add"
                          disabled={!canCreate}
                          style={{
                            opacity: canCreate ? 1 : 0.5,
                            cursor: canCreate ? 'pointer' : 'not-allowed',
                          }}
                          title="Thêm"
                        >
                          <FaPlus />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="btn btn-edit"
                          disabled={!canUpdate}
                          style={{
                            opacity: canUpdate ? 1 : 0.5,
                            cursor: canUpdate ? 'pointer' : 'not-allowed',
                          }}
                          title="Chỉnh sửa"
                        >
                          <FaEdit />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          className="btn btn-delete"
                          disabled={!canDelete}
                          style={{
                            opacity: canDelete ? 1 : 0.5,
                            cursor: canDelete ? 'pointer' : 'not-allowed',
                          }}
                          title="Xóa"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '20px' }}>
                  Không có dữ liệu để hiển thị
                </td>
              </tr>
            )}
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