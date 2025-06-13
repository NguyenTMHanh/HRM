import React, { useState, useEffect } from 'react';
import { message, Spin, Modal } from 'antd';
import TableComponent from '../../../../Shared/Table/Table';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreatePersonel from '../../../Create/CreatePersonel/CreatePersonel'; // Import CreatePersonel
import ConfirmDlg from './Dlg/ConfirmDeletePersonelDlg';

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

const HRPersonel = () => {
  const navigate = useNavigate();
  const [personelData, setPersonelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
    const [isConfirmDlgOpen, setIsConfirmDlgOpen] = useState(false); // Thêm trạng thái cho ConfirmDlg
  const [selectedItem, setSelectedItem] = useState(null); // Lưu item được chọn để xóa

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

  // Function to format breakLunch hours
  const formatBreakLunch = (hours) => {
    if (!hours) return '';
    return `${hours} giờ`;
  };

  // Function to format gender
  const formatGender = (gender) => {
    if (!gender) return '';
    return gender.toLowerCase() === 'female' ? 'Nữ' :
      gender.toLowerCase() === 'male' ? 'Nam' : gender;
  };

  // Function to map API data to component format for view/edit
  const mapApiDataToComponentFormat = (apiData) => {
    const displayGender = apiData.gender === 'Female' ? 'Nữ' : apiData.gender === 'Male' ? 'Nam' : '';
    return {
      employeeCode: apiData.employeeCode || '',
      fullName: apiData.nameEmployee || '',
      dateOfBirth: formatDate(apiData.dateOfBirth),
      gender: displayGender,
      username: apiData.username || '',
      password: '', // Password should not be fetched for security
      joinDate: formatDate(apiData.dateJoinCompany),
      department: apiData.departmentName || '',
      jobTitle: apiData.jobtitleName || '',
      level: apiData.rankName || '',
      position: apiData.positionName || '',
      managedBy: apiData.managerName || '',
      workLocation: apiData.branchName || '',
      workMode: apiData.jobTypeName || '',
      lunchBreak: formatBreakLunch(apiData.breakLunch),
      avatar: getImageUrl(apiData.avatarPath),
      roleGroup: apiData.roleName || '',
    };
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
          originalData: item,
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

  // Function to fetch personnel information by employee code
  const fetchPersonnelInformation = async (employeeCode, isEdit = false) => {
    try {
      if (isEdit) setEditLoading(true);
      else setViewLoading(true);
      const response = await axios.get(`/api/Employee/GetPersonelInformation?employeeCode=${employeeCode}`);
      if (response.data.code === 0) {
        const mappedData = mapApiDataToComponentFormat(response.data.data);
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
      console.error('Error fetching personnel information:', error);
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
    fetchPersonnelInformation(item.id);
  };

  // Handle Edit action
  const handleEdit = (item) => {
    if (!canUpdate) {
      message.error('Bạn không có quyền chỉnh sửa thông tin nhân sự.');
      return;
    }
    fetchPersonnelInformation(item.id, true);
  };

  // Handle Save action from Edit modal
  const handleEditSave = () => {
    setIsEditModalVisible(false);
    setEditData(null);
    fetchAllPersonelData(); // Refresh table data after save
  };

  // Handle modal close
  const handleViewModalClose = () => {
    setIsViewModalVisible(false);
    setViewData(null);
  };

  const handleEditModalClose = () => {
    setIsEditModalVisible(false);
    setEditData(null);
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
              backgroundColor: '#f5f5f5',
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
  const handleDelete = (item) => {
    if (!canDelete) {
      message.error('Bạn không có quyền xóa thông tin nhân sự.');
      return;
    }

    // Lưu item được chọn và mở ConfirmDlg
    setSelectedItem(item);
    setIsConfirmDlgOpen(true);
  };

    const handleConfirmDelete = async () => {
    if (!selectedItem) return;

    try {
      const response = await axios.delete(`/api/Employee/DeletePersonel/${selectedItem.id}`);

      if (response.data.code === 0) {
        message.success(`Đã xóa thông tin hồ sơ nhân sự ${selectedItem.name}`);
        fetchAllPersonelData(); // Làm mới dữ liệu bảng sau khi xóa
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi xóa thông tin hồ sơ nhân sự.');
      }
    } catch (error) {
      console.error('Error deleting personnel:', error);
      if (error.response) {
        const { status, data: errorData } = error.response;
        switch (status) {
          case 400:
            if (errorData.code === 1028) {
              message.error('Hồ sơ nhân sự không tồn tại.');
            } else {
              message.error(errorData.message || 'Yêu cầu không hợp lệ.');
            }
            break;
          case 401:
            message.error('Bạn không có quyền truy cập. Vui lòng đăng nhập lại.');
            break;
          case 403:
            message.error('Bạn không có quyền xóa thông tin hồ sơ nhân sự.');
            break;
          default:
            message.error('Có lỗi xảy ra khi xóa thông tin hồ sơ nhân sự.');
        }
      } else {
        message.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      }
    } finally {
      // Đóng ConfirmDlg sau khi xử lý
      setIsConfirmDlgOpen(false);
      setSelectedItem(null);
    }
  };

  // Handle Cancel Delete action
  const handleCancelDelete = () => {
    setIsConfirmDlgOpen(false);
    setSelectedItem(null);
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
    <>
      <TableComponent
        data={personelData}
        columns={columns}
        onEdit={canUpdate ? handleEdit : null}
        onDelete={canDelete ? handleDelete : null}
        onView={canView ? handleView : null} // Add onView prop
        onBranchShow={true}
        onDepartmentShow={true}
        filterData={filterData}
        showAdd={canCreate}
        showView={true} // Enable view button
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
        title="Xem thông tin hồ sơ nhân sự"
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
          <CreatePersonel
            initialData={viewData}
            isViewMode={true}
            onCancel={handleViewModalClose}
            isModalFooter={true}
          />
        ) : null}
      </Modal>
      {/* Edit Modal */}
      <Modal
        title="Chỉnh sửa thông tin hồ sơ nhân sự"
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
          <CreatePersonel
            initialData={editData}
            
            isEditMode={true}
            isViewMode={false}
            onSave={handleEditSave}
            onCancel={handleEditModalClose}
            isModalFooter={true}
          />
        ) : null}
      </Modal>
      <ConfirmDlg
        open={isConfirmDlgOpen}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        employeeCode={selectedItem?.id}
      />
    </>
  );
};

export default HRPersonel;