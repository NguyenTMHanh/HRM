import React, { useState, useEffect } from 'react';
import { message, Spin, Modal } from 'antd';
import TableComponent from '../../../../Shared/Table/Table';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreatePersonal from '../../../Create/CreatePersonal/CreatePersonal';

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
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

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

  const canView = permissions.some(
    (p) => p.moduleId === 'allModule' && p.actionId === 'fullAuthority'
  ) || permissions.some(
    (p) => p.moduleId === 'HrPersonel' && p.actionId === 'view'
  );

  // Function to get image URL from file ID (avatar)
  const getImageUrl = (fileId) => {
    if (!fileId) return '/default-avatar.png';
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

  // Function to map API data to component format
  const mapApiDataToComponentFormat = (apiData) => {
    const displayGender = apiData.gender === 'Female' ? 'Nữ' : apiData.gender === 'Male' ? 'Nam' : " ";
    return {      
      fullName: apiData.nameEmployee || " ",
      gender: displayGender,
      dateOfBirth: formatDate(apiData.dateOfBirth),
      nationality: apiData.nationality || " ",
      ethnicity: apiData.ethnicity || " ",
      identityNumber: apiData.numberIdentification || " ",
      issuedDate: formatDate(apiData.dateIssueIdentification),
      issuedPlace: apiData.placeIssueIdentification || " ",
      frontImage: getImageUrl(apiData.frontIdentificationPath),
      backImage: getImageUrl(apiData.backIdentificationPath),
      provinceResident: apiData.provinceResidence || " ",
      districtResident: apiData.districtResidence || " ",
      wardResident: apiData.wardResidence || " ",
      houseNumberResident: apiData.houseNumberResidence || " ",
      provinceContact: apiData.provinceContact || " ",
      districtContact: apiData.districtContact || " ",
      wardContact: apiData.wardContact || " ",
      houseNumberContact: apiData.houseNumberContact || " ",
      phoneNumber: apiData.phoneNumber || " ",
      email: apiData.email || " ",
      accountNumber: apiData.bankNumber || " ",
      bank: apiData.nameBank || " ",
      bankBranch: apiData.branchBank || " ",
      employeeCode: apiData.employeeCode || " ",
    };
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

  // Function to fetch personal information by employee code
  const fetchPersonalInformation = async (employeeCode, isEdit = false) => {
    try {
      if (isEdit) setEditLoading(true);
      else setViewLoading(true);
      const response = await axios.get(`/api/Employee/GetPersonalInformation?employeeCode=${employeeCode}`);
      if (response.data.code === 0) {
        const mappedData = mapApiDataToComponentFormat(response.data.data);
        console.log ('response.data.data ', response.data.data)
        console.log ('mappedData ', mappedData)
        if (isEdit) {
          setEditData(mappedData);
          setIsEditModalVisible(true);
        } else {
          setViewData(mappedData);
          setIsViewModalVisible(true);
        }
      } else {
        message.error(response.data.message || 'Không thể tải thông tin nhân sự.');
      }
    } catch (error) {
      console.error('Error fetching personal information:', error);
      message.error('Có lỗi xảy ra khi tải thông tin nhân sự.');
    } finally {
      if (isEdit) setEditLoading(false);
      else setViewLoading(false);
    }
  };

  // Handle View action
  const handleView = (item) => {
    if (!canView) {
      message.error('Bạn không có quyền xem thông tin nhân sự.');
      return;
    }
    fetchPersonalInformation(item.id);
  };

  // Handle Edit action
  const handleEdit = (item) => {
    if (!canUpdate) {
      message.error('Bạn không có quyền chỉnh sửa thông tin nhân sự.');
      return;
    }
    fetchPersonalInformation(item.id, true);
  };

  // Handle Save action from Edit modal
  const handleEditSave = () => {
    setIsEditModalVisible(false);
    setEditData(null);
    fetchAllPersonalData(); // Refresh table data after save
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
              e.target.src = '/default-avatar.png';
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

  const handleDelete = async (item) => {
    if (!canDelete) {
      message.error('Bạn không có quyền xóa thông tin nhân sự.');
      return;
    }
    
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa nhân sự ${item.name} (${item.id})?`);
    if (!confirmed) return;

    try {
      message.success(`Đã xóa thông tin nhân sự ${item.name}`);
      fetchAllPersonalData();
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

  const handleViewModalClose = () => {
    setIsViewModalVisible(false);
    setViewData(null);
  };

  const handleEditModalClose = () => {
    setIsEditModalVisible(false);
    setEditData(null);
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
    <>
      <TableComponent
        data={personalData}
        columns={columns}
        onEdit={canUpdate ? handleEdit : null}
        onDelete={canDelete ? handleDelete : null}
        onView={canView ? handleView : null}
        onBranchShow={false}
        onDepartmentShow={false}
        filterData={filterData}
        showAdd={canCreate}
        showView={true}
        groupBy={columnGroups}
        onCreate={canCreate ? handleCreate : null}
        onRefresh={handleRefresh}
        emptyText="Chưa có dữ liệu nhân sự"
        canCreate={canCreate}
        canUpdate={canUpdate}
        canDelete={canDelete}
        canView={canView}
      />
      {/* View Modal */}
      <Modal
        title="Xem thông tin cá nhân"
        open={isViewModalVisible}
        onCancel={handleViewModalClose}
        footer={null}
        width={1000}
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      >
        {viewLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px' }}>Đang tải thông tin...</div>
          </div>
        ) : viewData ? (
          <CreatePersonal
            initialData={viewData}
            isViewMode={true}
            onCancel={handleViewModalClose}
            isModalFooter={true}
          />
        ) : null}
      </Modal>
      {/* Edit Modal */}
      <Modal
        title="Chỉnh sửa thông tin cá nhân"
        open={isEditModalVisible}
        onCancel={handleEditModalClose}
        footer={null}
        width={1000}
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      >
        {editLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px' }}>Đang tải thông tin...</div>
          </div>
        ) : editData ? (
          <CreatePersonal
            initialData={editData}
            isEditMode={true}
            isViewMode={false}
            onSave={handleEditSave}
            onCancel={handleEditModalClose}
            isModalFooter={true}
          />
        ) : null}
      </Modal>
    </>
  );
};

export default HRPersonal;
