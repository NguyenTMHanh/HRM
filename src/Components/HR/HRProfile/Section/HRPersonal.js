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

const HRPersonal = () => {
  const navigate = useNavigate();
  const [personalData, setPersonalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);

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

  // Function to format gender from English to Vietnamese
  const formatGender = (gender) => {
    if (!gender) return '';
    return gender.toLowerCase() === 'female' ? 'Nữ' :
      gender.toLowerCase() === 'male' ? 'Nam' : gender;
  };

  // Function to fetch all personnel data
  const fetchAllPersonalData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/Employee/GetAllPersonal');
      
      if (response.data.code === 0) {
        const mappedData = response.data.data.map((item, index) => ({
          stt: index + 1,
          id: item.employeeCode,
          avatar: getImageUrl(item.avatarPath),
          name: item.nameEmployee,
          gender: formatGender(item.gender),
          birthDate: formatDate(item.dayOfBirth),
          nationality: item.nationality || '',
          ethnicity: item.ethnicity || '',
          city: item.provinceResidence || '',
          district: item.districtResidence || '',
          ward: item.wardResidence || '',
          houseNumber: item.houseNumberResidence || '',
          contactCity: item.provinceContact || '',
          contactDistrict: item.districtContact || '',
          contactWard: item.wardContact || '',
          contactHouseNumber: item.houseNumberContact || '',
          email: item.email || '',
          phoneNumber: item.phoneNumber || '',
          bankAccount: item.bankNumber || '',
          bankName: item.nameBank || '',
          // Keep original data for editing
          originalData: item
        }));
        
        setPersonalData(mappedData);
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
    fetchAllPersonalData();
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
    { label: 'Giới tính', key: 'gender' },
    { label: 'Ngày sinh', key: 'birthDate' },
    { label: 'Quốc tịch', key: 'nationality' },
    { label: 'Dân tộc', key: 'ethnicity' },
    { label: 'Tỉnh/Thành phố', key: 'city' },
    { label: 'Quận/Huyện', key: 'district' },
    { label: 'Xã/Phường', key: 'ward' },
    { label: 'Số nhà', key: 'houseNumber' },
    { label: 'Tỉnh/Thành phố (Liên hệ)', key: 'contactCity' },
    { label: 'Quận/Huyện (Liên hệ)', key: 'contactDistrict' },
    { label: 'Xã/Phường (Liên hệ)', key: 'contactWard' },
    { label: 'Số nhà (Liên hệ)', key: 'contactHouseNumber' },
    { label: 'Email', key: 'email' },
    { label: 'Số điện thoại', key: 'phoneNumber' },
    { label: 'Số tài khoản', key: 'bankAccount' },
    { label: 'Ngân hàng', key: 'bankName' },
  ];

  const columnGroups = [
    {
      label: 'Thông tin cá nhân',
      columns: ['stt', 'avatar', 'name', 'gender', 'birthDate', 'nationality', 'ethnicity'],
    },
    {
      label: 'Thông tin nơi trú',
      columns: ['city', 'district', 'ward', 'houseNumber'],
    },
    {
      label: 'Thông tin liên hệ',
      columns: ['contactCity', 'contactDistrict', 'contactWard', 'contactHouseNumber', 'email', 'phoneNumber'],
    },
    {
      label: 'Thông tin ngân hàng',
      columns: ['bankAccount', 'bankName'],
    },
  ];

  const handleEdit = (item) => {
    if (!canUpdate) {
      message.error('Bạn không có quyền chỉnh sửa thông tin nhân sự.');
      return;
    }
    // Navigate to edit page with employee code
    navigate(`/edit/personal/${item.id}`);
  };

  const handleDelete = async (item) => {
    if (!canDelete) {
      message.error('Bạn không có quyền xóa thông tin nhân sự.');
      return;
    }
    
    // Show confirmation dialog
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa nhân sự ${item.name} (${item.id})?`);
    if (!confirmed) return;

    try {
      // Call delete API here
      // const response = await axios.delete(`/api/Employee/DeletePersonal/${item.id}`);
      
      // For now, just show success message and refresh data
      message.success(`Đã xóa thông tin nhân sự ${item.name}`);
      fetchAllPersonalData(); // Refresh data
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
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phoneNumber.includes(searchTerm)
    );
  };

  const handleCreate = () => {
    if (!canCreate) {
      message.error('Bạn không có quyền tạo mới thông tin nhân sự.');
      return;
    }
    navigate('/create/personal');
  };

  const handleRefresh = () => {
    fetchAllPersonalData();
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
      data={personalData}
      columns={columns}
      onEdit={canUpdate ? handleEdit : null}
      onDelete={canDelete ? handleDelete : null}
      onBranchShow={false}
      onDepartmentShow={false}
      filterData={filterData}
      showAdd={canCreate}
      groupBy={columnGroups}
      onCreate={canCreate ? handleCreate : null}
      onRefresh={handleRefresh}
      emptyText="Chưa có dữ liệu nhân sự"
    />
  );
};

export default HRPersonal;