import React, { useState, useEffect } from 'react';
import { message, Spin } from 'antd';
import TableComponent from '../../../../Shared/Table/Table';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

const HRTax = () => {
  const navigate = useNavigate();
  const [taxData, setTaxData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);

  // Load permissions from localStorage
  useEffect(() => {
    const storedPermissions = JSON.parse(localStorage.getItem('permissions')) || [];
    setPermissions(storedPermissions);
  }, []);

  // Permission checks
  const canUpdate = permissions.some(
    (p) => p.moduleId === 'allModule' && p.actionId === 'fullAuthority'
  ) || permissions.some(
    (p) => p.moduleId === 'HrPersonel' && p.actionId === 'update'
  );

  const canDelete = permissions.some(
    (p) => p.moduleId === 'allModule' && p.actionId === 'fullAuthority'
  ) || permissions.some(
    (p) => p.moduleId === 'HrPersonel' && p.actionId === 'delete'
  );

  const canCreate = permissions.some(
    (p) => p.moduleId === 'allModule' && p.actionId === 'fullAuthority'
  ) || permissions.some(
    (p) => p.moduleId === 'HrPersonel' && p.actionId === 'create'
  );

  // Function to get image URL from file ID (avatar)
  const getImageUrl = (fileId) => {
    if (!fileId) return '/default-avatar.png'; // Default avatar
    return `${axios.defaults.baseURL}/api/FileUpload/GetFile/${fileId}`;
  };

  // Function to format hasTax
  const formatHasTax = (hasTax) => {
    return hasTax ? 'Có' : 'Không';
  };

  // Function to fetch all tax data from API
  const fetchAllTaxData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/Employee/GetAllTax');

      if (response.data.code === 0) {
        const mappedData = response.data.data.map((item, index) => ({
          stt: index + 1,
          employeeId: item.employeeCode,
          fullName: item.nameEmployee,
          avatar: getImageUrl(item.avatarPath),
          branch: item.branchName,
          department: item.departmentName,
          position: item.positionName,
          hasTaxCode: formatHasTax(item.hasTax),
          taxCode: item.codeTax || '',
          dependents: item.countDependent,
          // Keep original data for editing
          originalData: item
        }));

        setTaxData(mappedData);
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi tải dữ liệu thuế TNCN.');
      }
    } catch (error) {
      console.error('Error fetching tax data:', error);

      if (error.response) {
        const { status, data: errorData } = error.response;
        switch (status) {
          case 401:
            message.error('Bạn không có quyền truy cập. Vui lòng đăng nhập lại.');
            break;
          case 403:
            message.error('Bạn không có quyền xem thông tin thuế TNCN.');
            break;
          default:
            message.error(errorData?.message || 'Có lỗi xảy ra khi tải dữ liệu thuế TNCN.');
        }
      } else {
        message.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTaxData();
  }, []);

  const columns = [
    { label: 'STT', key: 'stt' },
    {
      label: 'Mã số nhân sự',
      key: 'avatar',
      render: (value, item) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={value}
            alt={`${item.fullName}'s avatar`}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1px solid #d9d9d9',
              backgroundColor: '#f5f5f5'
            }}
            onError={(e) => {
              e.target.src = '/default-avatar.png'; // Fallback to default avatar
            }}
          />
          <span>{item.employeeId}</span>
        </div>
      ),
    },
    { label: 'Họ và tên NLĐ', key: 'fullName' },
    { label: 'Chi nhánh', key: 'branch' },
    { label: 'Bộ phận', key: 'department' },
    { label: 'Vị trí', key: 'position' },
    { label: 'Đã có mã số thuế TNCN', key: 'hasTaxCode' },
    { label: 'Mã số thuế TNCN', key: 'taxCode' },
    { label: 'Số lượng người phụ thuộc', key: 'dependents' },
  ];

  const columnGroups = [
    {
      label: 'Thông tin hồ sơ nhân sự',
      columns: ['stt', 'avatar', 'fullName', 'branch', 'department', 'position'],
    },
    {
      label: 'Thông tin thuế TNCN',
      columns: ['hasTaxCode', 'taxCode', 'dependents'],
    },
  ];

  const handleEdit = (item) => {
    if (!canUpdate) {
      message.error('Bạn không có quyền chỉnh sửa thông tin thuế TNCN.');
      return;
    }
    navigate(`/edit/tax/${item.employeeId}`);
  };

  const handleDelete = async (item) => {
    if (!canDelete) {
      message.error('Bạn không có quyền xóa thông tin thuế TNCN.');
      return;
    }

    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa thông tin thuế TNCN của ${item.fullName} (${item.employeeId})?`);
    if (!confirmed) return;

    try {
      // Placeholder for delete API call
      // const response = await axios.delete(`/api/Employee/DeleteTax/${item.employeeId}`);
      message.success(`Đã xóa thông tin thuế TNCN của ${item.fullName}`);
      fetchAllTaxData(); // Refresh data
    } catch (error) {
      console.error('Error deleting tax:', error);
      message.error('Có lỗi xảy ra khi xóa thông tin thuế TNCN.');
    }
  };

  const filterData = (data, searchTerm) => {
    return data.filter(
      (item) =>
        item.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.taxCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleCreate = () => {
    if (!canCreate) {
      message.error('Bạn không có quyền tạo mới thông tin thuế TNCN.');
      return;
    }
    navigate('/create/tax');
  };

  const handleRefresh = () => {
    fetchAllTaxData();
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Đang tải dữ liệu thuế TNCN...</div>
      </div>
    );
  }

  return (
    <TableComponent
      data={taxData}
      columns={columns}
      onEdit={canUpdate ? handleEdit : null}
      onDelete={canDelete ? handleDelete : null}
      onBranchShow={true}
      onDepartmentShow={true}
      filterData={filterData}
      showAdd={canCreate}
      groupBy={columnGroups}
      onCreate={canCreate ? handleCreate : null}
      onRefresh={handleRefresh}
      emptyText="Chưa có dữ liệu thuế TNCN"
    />
  );
};

export default HRTax;