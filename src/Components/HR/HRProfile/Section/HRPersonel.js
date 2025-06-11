import React, { useState, useEffect } from 'react';
import { message, Spin } from 'antd';
import TableComponent from '../../../../Shared/Table/Table';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Axios configuration (assuming it's globally set as in HRPersonal)
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

const HRPersonel = () => {
  const navigate = useNavigate();
  const [personelData, setPersonelData] = useState([]);
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
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Function to format breakLunch hours
  const formatBreakLunch = (hours) => {
    if (!hours) return '';
    return `${hours} giờ`;
  };

  // Function to fetch all personnel data from API
  const fetchAllPersonelData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/Employee/GetAllPersonel');

      if (response.data.code === 0) {
        const mappedData = response.data.data.map((item, index) => ({
          stt: index + 1,
          id: item.employeeCode,
          avatar: getImageUrl(item.avatarPath),
          name: item.nameEmployee,
          branch: item.branchName,
          department: item.departmentName,
          jobTitle: item.jobtitleName,
          rank: item.rankName,
          position: item.positionName,
          joinDate: formatDate(item.dateJoinCompany),
          managedBy: item.nameManager,
          workType: item.jobtypeName,
          lunchBreak: formatBreakLunch(item.breakLunch),
          phoneNumber: item.phoneNumber,
          // Keep original data for editing
          originalData: item
        }));

        setPersonelData(mappedData);
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi tải dữ liệu nhân sự.');
      }
    } catch (error) {
      console.error('Error fetching personnel data:', error);

      if (error.response) {
        const { status, data: errorData } = error.response;
        switch (status) {
          case 401:
            message.error('Bạn không có quyền truy cập. Vui lòng đăng nhập lại.');
            break;
          case 403:
            message.error('Bạn không có quyền xem thông tin nhân sự.');
            break;
          default:
            message.error(errorData?.message || 'Có lỗi xảy ra khi tải dữ liệu nhân sự.');
        }
      } else {
        message.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPersonelData();
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
          <span>{item.id}</span>
        </div>
      ),
    },
    { label: 'Họ và tên NLĐ', key: 'name' },
    { label: 'Chi nhánh', key: 'branch' },
    { label: 'Bộ phận', key: 'department' },
    { label: 'Chức vụ', key: 'jobTitle' },
    { label: 'Cấp bậc', key: 'rank' },
    { label: 'Vị trí', key: 'position' },
    { label: 'Ngày gia nhập', key: 'joinDate' },
    { label: 'Được quản lý bởi', key: 'managedBy' },
    { label: 'Hình thức làm việc', key: 'workType' },
    { label: 'Giờ nghỉ trưa', key: 'lunchBreak' },
    { label: 'Số điện thoại', key: 'phoneNumber' },
  ];

  const columnGroups = [
    {
      label: 'Thông tin hồ sơ nhân sự',
      columns: ['stt', 'avatar', 'name', 'branch', 'department', 'jobTitle', 'rank', 'position', 'joinDate', 'managedBy', 'workType', 'lunchBreak'],
    },
    {
      label: 'Thông tin liên hệ',
      columns: ['phoneNumber'],
    },
  ];

  const handleEdit = (item) => {
    if (!canUpdate) {
      message.error('Bạn không có quyền chỉnh sửa thông tin nhân sự.');
      return;
    }
    navigate(`/edit/personel/${item.id}`);
  };

  const handleDelete = async (item) => {
    if (!canDelete) {
      message.error('Bạn không có quyền xóa thông tin nhân sự.');
      return;
    }

    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa nhân sự ${item.name} (${item.id})?`);
    if (!confirmed) return;

    try {
      // Placeholder for delete API call
      // const response = await axios.delete(`/api/Employee/DeletePersonel/${item.id}`);
      message.success(`Đã xóa thông tin nhân sự ${item.name}`);
      fetchAllPersonelData(); // Refresh data
    } catch (error) {
      console.error('Error deleting personnel:', error);
      message.error('Có lỗi xảy ra khi xóa thông tin nhân sự.');
    }
  };

  const filterData = (data, searchTerm) => {
    return data.filter(
      (item) =>
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phoneNumber.includes(searchTerm)
    );
  };

  const handleCreate = () => {
    if (!canCreate) {
      message.error('Bạn không có quyền tạo mới thông tin nhân sự.');
      return;
    }
    navigate('/create/personel');
  };

  const handleRefresh = () => {
    fetchAllPersonelData();
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Đang tải dữ liệu nhân sự...</div>
      </div>
    );
  }

  return (
    <TableComponent
      data={personelData}
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
      emptyText="Chưa có dữ liệu nhân sự"
    />
  );
};

export default HRPersonel;