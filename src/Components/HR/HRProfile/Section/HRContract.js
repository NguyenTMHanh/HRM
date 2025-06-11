import React, { useState, useEffect } from 'react';
import { message, Spin } from 'antd';
import TableComponent from '../../../../Shared/Table/Table';
import Status from '../../../../Shared/Status/Status';
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

const HRContract = () => {
  const navigate = useNavigate();
  const [contractData, setContractData] = useState([]);
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

  // Function to format date from API response
  const formatDate = (dateString) => {
    if (!dateString || dateString === '0001-01-01T00:00:00Z') return ''; // Handle invalid or empty dates
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Function to format contract type
  const formatContractType = (type) => {
    if (!type) return '';
    return type === 'LimitedContract' ? 'Xác định thời hạn' : 'Không xác định thời hạn';
  };

  // Function to format contract status
  const formatContractStatus = (status) => {
    if (!status) return '';
    return status === 'Valid' ? 'Còn hiệu lực' : status;
  };

  // Function to format hourly salary
  const formatHourlySalary = (salary) => {
    if (!salary) return '';
    return salary.toLocaleString('vi-VN') + ' VNĐ';
  };

  // Function to fetch all contract data from API
  const fetchAllContractData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/Employee/GetAllContract');

      if (response.data.code === 0) {
        const mappedData = response.data.data.map((item, index) => ({
          stt: index + 1,
          contractId: item.contractCode,
          name: item.nameEmployee,
          employeeId: item.employeeCode,
          avatar: getImageUrl(item.avatarPath),
          branch: item.branchName,
          department: item.departmentName,
          position: item.positionName,
          contractType: formatContractType(item.typeContract),
          status: formatContractStatus(item.statusContract),
          hourlyRate: formatHourlySalary(item.hourlySalary),
          standardHoursPerDay: item.hourWorkStandard,
          salaryCoefficient: item.coefficientSalary,
          validFrom: formatDate(item.startContract),
          validTo: formatDate(item.endContract),
          // Keep original data for editing
          originalData: item
        }));

        setContractData(mappedData);
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi tải dữ liệu hợp đồng.');
      }
    } catch (error) {
      console.error('Error fetching contract data:', error);

      if (error.response) {
        const { status, data: errorData } = error.response;
        switch (status) {
          case 401:
            message.error('Bạn không có quyền truy cập. Vui lòng đăng nhập lại.');
            break;
          case 403:
            message.error('Bạn không có quyền xem thông tin hợp đồng.');
            break;
          default:
            message.error(errorData?.message || 'Có lỗi xảy ra khi tải dữ liệu hợp đồng.');
        }
      } else {
        message.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllContractData();
  }, []);

  const columns = [
    { label: 'STT', key: 'stt' },
    {
      label: 'Mã nhân sự',
      key: 'avatar',
      render: (value, item) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={value}
            alt={`${item.name}'s avatar`}
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
    { label: 'Họ và tên NLĐ', key: 'name' },
    { label: 'Chi nhánh', key: 'branch' },
    { label: 'Bộ phận', key: 'department' },
    { label: 'Vị trí', key: 'position' },
    { label: 'Mã HĐLĐ', key: 'contractId' },
    { label: 'Loại hợp đồng', key: 'contractType' },
    {
      label: 'Tình trạng',
      key: 'status',
      render: (status) => (
        <Status status={status === 'Còn hiệu lực' ? 'active' : 'inactive'} type="contract" />
      ),
    },
    { label: 'Mức lương /1h', key: 'hourlyRate' },
    { label: 'Số giờ làm việc chuẩn/1 ngày', key: 'standardHoursPerDay' },
    { label: 'Hệ số lương', key: 'salaryCoefficient' },
    { label: 'Hiệu lực từ', key: 'validFrom' },
    { label: 'Hiệu lực đến', key: 'validTo' },
  ];

  const columnGroups = [
    {
      label: 'Thông tin hồ sơ nhân sự',
      columns: ['stt', 'avatar', 'name', 'branch', 'department', 'position'],
    },
    {
      label: 'Thông tin HĐLĐ',
      columns: [
        'contractId',
        'contractType',
        'status',
        'hourlyRate',
        'standardHoursPerDay',
        'salaryCoefficient',
        'validFrom',
        'validTo',
      ],
    },
  ];

  const handleEdit = (item) => {
    if (!canUpdate) {
      message.error('Bạn không có quyền chỉnh sửa thông tin hợp đồng.');
      return;
    }
    navigate(`/edit/contract/${item.contractId}`);
  };

  const handleDelete = async (item) => {
    if (!canDelete) {
      message.error('Bạn không có quyền xóa thông tin hợp đồng.');
      return;
    }

    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa hợp đồng ${item.contractId} của ${item.name}?`);
    if (!confirmed) return;

    try {
      // Placeholder for delete API call
      // const response = await axios.delete(`/api/Employee/DeleteContract/${item.contractId}`);
      message.success(`Đã xóa hợp đồng ${item.contractId}`);
      fetchAllContractData(); // Refresh data
    } catch (error) {
      console.error('Error deleting contract:', error);
      message.error('Có lỗi xảy ra khi xóa thông tin hợp đồng.');
    }
  };

  const filterData = (data, searchTerm) => {
    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.contractId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleCreate = () => {
    if (!canCreate) {
      message.error('Bạn không có quyền tạo mới thông tin hợp đồng.');
      return;
    }
    navigate('/create/contract');
  };

  const handleRefresh = () => {
    fetchAllContractData();
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Đang tải dữ liệu hợp đồng...</div>
      </div>
    );
  }

  return (
    <TableComponent
      data={contractData}
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
      emptyText="Chưa có dữ liệu hợp đồng"
    />
  );
};

export default HRContract;