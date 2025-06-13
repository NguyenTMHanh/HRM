import React, { useState, useEffect } from 'react';
import { message, Spin, Modal } from 'antd';
import TableComponent from '../../../../Shared/Table/Table';
import Status from '../../../../Shared/Status/Status';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateInsurance from '../../../Create/CreateInsurance/CreateInsurance';
import ConfirmDlg from './Dlg/ConfirmDeleteInsuranceDlg';

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

const HRInsurance = () => {
  const navigate = useNavigate();
  const [insuranceData, setInsuranceData] = useState([]);
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
    if (!dateString || dateString === '0001-01-01T00:00:00Z') return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Function to format rate as percentage
  const formatRate = (businessRate, employeeRate) => {
    if (!businessRate && !employeeRate) return '0%';
    return `${employeeRate || 0}% NLĐ / ${businessRate || 0}% DN`;
  };

  // Function to format hasBhxh
  const formatHasBhxh = (hasBhxh) => {
    return hasBhxh ? 'Có tham gia' : 'Không tham gia';
  };

  // Function to map API data to component format for view/edit
  const mapApiDataToComponentFormat = (apiData) => {
    return {
      employeeCode: apiData.employeeCode || '',
      fullName: apiData.nameEmployee || '',
      dateOfBirth: formatDate(apiData.dateOfBirth),
      gender: apiData.gender || '',
      bhytCode: apiData.codeBHYT || '',
      bhytRate: formatRate(apiData.rateBHYTBussiness, apiData.rateBHYTEmpt),
      registeredHospital: apiData.registerMedical || '',
      bhytStartDate: formatDate(apiData.dateStartParticipateBHYT),
      hasJoined: formatHasBhxh(apiData.hasBHXH),
      bhxhCode: apiData.codeBHXH || '',
      bhxhRate: formatRate(apiData.rateBHXHBussiness, apiData.rateBHXHEmpt),
      bhxhStartDate: formatDate(apiData.dateStartParticipateBHXH),
      bhtnRate: formatRate(apiData.rateBHTNBussiness, apiData.rateBHTNEmpt),
      bhtnStartDate: formatDate(apiData.dateStartParticipateBHTN),
      bhStatus: apiData.insuranceStatus || '',
      bhEndDate: formatDate(apiData.dateEndParticipateInsurance),
      avatar: getImageUrl(apiData.avatarPath),
    };
  };

  // Function to fetch all insurance data from API
  const fetchAllInsuranceData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/Employee/GetAllInsurance');

      if (response.data.code === 0) {
        const mappedData = response.data.data.map((item, index) => ({
          stt: index + 1,
          employeeId: item.employeeCode,
          fullName: item.nameEmployee,
          avatar: getImageUrl(item.avatarPath),
          branch: item.branchName,
          department: item.departmentName,
          position: item.positionName,
          bhytId: item.codeBHYT,
          bhytRate: formatRate(item.businessRateBHYT, item.emptRateBHYT),
          hasBhxh: formatHasBhxh(item.hasBHXH),
          bhxhId: item.codeBHXH || '',
          bhxhRate: formatRate(item.bussinessRateBHXH, item.emptRateBHXH),
          bhtnRate: formatRate(item.businessRateBHTN, item.emptRateBHTN),
          insuranceStatus: item.statusInsurance,
          endDate: formatDate(item.endInsurance),
          // Keep original data for editing
          originalData: item
        }));

        setInsuranceData(mappedData);
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi tải dữ liệu bảo hiểm.');
      }
    } catch (error) {
      console.error('Error fetching insurance data:', error);
      if (error.response) {
        const { status, data: errorData } = error.response;
        switch (status) {
          case 401:
            message.error('Bạn không có quyền truy cập. Vui lòng đăng nhập lại.');
            break;
          case 403:
            message.error('Bạn không có quyền xem thông tin bảo hiểm.');
            break;
          default:
            message.error(errorData?.message || 'Có lỗi xảy ra khi tải dữ liệu bảo hiểm.');
        }
      } else {
        message.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch insurance information by employee code
  const fetchInsuranceInformation = async (employeeCode, isEdit = false) => {
    try {
      if (isEdit) setEditLoading(true);
      else setViewLoading(true);
      const response = await axios.get(`/api/Employee/GetInsuranceInformation?employeeCode=${employeeCode}`);
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
        message.error(response.data.message || 'Không thể tải thông tin bảo hiểm.');
      }
    } catch (error) {
      console.error('Error fetching insurance information:', error);
      message.error('Có lỗi xảy ra khi tải thông tin bảo hiểm.');
    } finally {
      if (isEdit) setEditLoading(false);
      else setViewLoading(false);
    }
  };

  // Handle View action
  const handleView = (item) => {
    if (!canView) {
      message.error('Bạn không có quyền xem thông tin bảo hiểm.');
      return;
    }
    fetchInsuranceInformation(item.employeeId);
  };

  // Handle Edit action
  const handleEdit = (item) => {
    if (!canUpdate) {
      message.error('Bạn không có quyền chỉnh sửa thông tin bảo hiểm.');
      return;
    }
    fetchInsuranceInformation(item.employeeId, true);
  };

  // Handle Save action from Edit modal
  const handleEditSave = () => {
    setIsEditModalVisible(false);
    setEditData(null);
    fetchAllInsuranceData(); // Refresh table data after save
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
    fetchAllInsuranceData();
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
            alt={`${item.fullName}'s avatar`}
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
          <span>{item.employeeId}</span>
        </div>
      ),
    },
    { label: 'Họ và tên NLĐ', key: 'fullName' },
    { label: 'Chi nhánh', key: 'branch' },
    { label: 'Bộ phận', key: 'department' },
    { label: 'Vị trí', key: 'position' },
    { label: 'Mã số BHYT', key: 'bhytId' },
    { label: 'Tỷ lệ đóng BHYT (NLĐ/DN)', key: 'bhytRate' },
    { label: 'Đã tham gia BHXH', key: 'hasBhxh' },
    { label: 'Mã số BHXH', key: 'bhxhId' },
    { label: 'Tỷ lệ đóng BHXH (NLĐ/DN)', key: 'bhxhRate' },
    { label: 'Tỷ lệ đóng BHTN (NLĐ/DN)', key: 'bhtnRate' },
    {
      label: 'Tình trạng đóng BH',
      key: 'insuranceStatus',
      render: (status) => (
        <Status status={status === 'Đang tham gia' ? 'active' : 'inactive'} type="insurance" />
      ),
    },
    { label: 'Ngày kết thúc đóng', key: 'endDate' },
  ];

  const columnGroups = [
    {
      label: 'Thông tin hồ sơ nhân sự',
      columns: ['stt', 'avatar', 'fullName', 'branch', 'department', 'position'],
    },
    {
      label: 'Thông tin BHYT',
      columns: ['bhytId', 'bhytRate'],
    },
    {
      label: 'Thông tin BHXH',
      columns: ['hasBhxh', 'bhxhId', 'bhxhRate'],
    },
    {
      label: 'Thông tin BHTN',
      columns: ['bhtnRate'],
    },
    {
      label: 'Thông tin chung đóng BH',
      columns: ['insuranceStatus', 'endDate'],
    },
  ];

  // Handle Delete action
  const handleDelete = (item) => {
    if (!canDelete) {
      message.error('Bạn không có quyền xóa thông tin bảo hiểm.');
      return;
    }

    // Lưu item được chọn và mở ConfirmDlg
    setSelectedItem(item);
    setIsConfirmDlgOpen(true);
  };

  // Handle Confirm Delete action
  const handleConfirmDelete = async () => {
    if (!selectedItem) return;

    try {
      const response = await axios.delete(`/api/Employee/DeleteInsurance/${selectedItem.employeeId}`);

      if (response.data.code === 0) {
        message.success(`Đã xóa thông tin bảo hiểm của ${selectedItem.fullName}`);
        fetchAllInsuranceData(); // Làm mới dữ liệu bảng sau khi xóa
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi xóa thông tin bảo hiểm.');
      }
    } catch (error) {
      console.error('Error deleting insurance:', error);
      if (error.response) {
        const { status, data: errorData } = error.response;
        switch (status) {
          case 400:
            if (errorData.code === 1029) {
              message.error('Thông tin bảo hiểm không tồn tại.');
            } else {
              message.error(errorData.message || 'Yêu cầu không hợp lệ.');
            }
            break;
          case 401:
            message.error('Bạn không có quyền truy cập. Vui lòng đăng nhập lại.');
            break;
          case 403:
            message.error('Bạn không có quyền xóa thông tin bảo hiểm.');
            break;
          default:
            message.error('Có lỗi xảy ra khi xóa thông tin bảo hiểm.');
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
        item.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.bhytId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.bhxhId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleCreate = () => {
    if (!canCreate) {
      message.error('Bạn không có quyền tạo mới thông tin bảo hiểm.');
      return;
    }
    navigate('/create/insurance');
  };

  const handleRefresh = () => {
    fetchAllInsuranceData();
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Đang tải dữ liệu bảo hiểm...</div>
      </div>
    );
  }

  return (
    <>
      <TableComponent
        data={insuranceData}
        columns={columns}
        onEdit={canUpdate ? handleEdit : null}
        onDelete={canDelete ? handleDelete : null}
        onView={canView ? handleView : null}
        onBranchShow={true}
        onDepartmentShow={true}
        filterData={filterData}
        showAdd={canCreate}
        showView={true}
        groupBy={columnGroups}
        onCreate={canCreate ? handleCreate : null}
        onRefresh={handleRefresh}
        emptyText="Chưa có dữ liệu bảo hiểm"
        canCreate={canCreate}
        canUpdate={canUpdate}
        canDelete={canDelete}
        canView={canView}
      />
      {/* View Modal */}
      <Modal
        title="Xem thông tin bảo hiểm"
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
          <CreateInsurance
            initialData={viewData}
            isViewMode={true}
            onCancel={handleViewModalClose}
            isModalFooter={true}
          />
        ) : null}
      </Modal>
      {/* Edit Modal */}
      <Modal
        title="Chỉnh sửa thông tin bảo hiểm"
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
          <CreateInsurance
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
        employeeCode={selectedItem?.employeeId}
        bhytId={selectedItem?.bhytId}
        bhxhId={selectedItem?.bhxhId}
      />
    </>
  );
};

export default HRInsurance;