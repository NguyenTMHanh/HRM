import React, { useState, useEffect } from 'react';
import { message, Spin, Modal } from 'antd';
import TableComponent from '../../../../Shared/Table/Table';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateTax from '../../../Create/CreateTax/CreateTax';
import ConfirmDlg from './Dlg/ConfirmDeleteTaxDlg';

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

  // Function to fetch file from server
  const fetchFile = async (fileId) => {
    try {
      const response = await axios.get(`/api/FileUpload/GetFile/${fileId}`, {
        responseType: 'blob', // Nhận dữ liệu dạng blob (ảnh)
      });
      const fileUrl = URL.createObjectURL(response.data); // Tạo URL tạm thời từ blob
      return fileUrl;
    } catch (error) {
      console.error('Error fetching file:', error);
      message.error('Không thể tải file.');
      return null;
    }
  };

  // Function to format date from API response
  const formatDate = (dateString) => {
    if (!dateString || dateString === '0001-01-01T00:00:00Z') return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Function to format hasTax
  const formatHasTax = (hasTax) => {
    return hasTax ? 'Có' : 'Không';
  };
  const formatGender = (gender) => {
    if (!gender) return '';
    return gender.toLowerCase() === 'female' ? 'Nữ' :
      gender.toLowerCase() === 'male' ? 'Nam' : gender;
  };
  // Function to map API data to component format for view/edit
  const mapApiDataToComponentFormat = (apiData) => {
    return {
      employeeCode: apiData.employeeCode || " ",
      fullName: apiData.nameEmployee || " ",
      gender: formatGender(apiData.gender),
      dateOfBirth: formatDate(apiData.dateOfBirth),
      hasTax: apiData.hasTaxCode || false,
      taxCode: apiData.taxCode || '',
      dependents: apiData.dependents?.map((dependent) => ({
        registered: dependent.registerDependentStatus || '',
        taxCode: dependent.taxCode || '',
        fullName: dependent.nameDependent || '',
        birthDate: dependent.dayOfBirthDependent ? formatDate(dependent.dayOfBirthDependent) : '',
        relationship: dependent.relationship || '',
        proofFile: dependent.evidencePath
          ? [
            {
              uid: dependent.evidencePath,
              name: dependent.evidencePath, // File name (will be updated after fetching file)
              status: 'done',
              fileId: dependent.evidencePath, // Store file ID for fetching
            },
          ]
          : [],
      })) || [],
    };
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
          hasTaxCode: formatHasTax(item.hasTaxCode),
          taxCode: item.codeTax || '',
          dependents: item.countDependent || '0',
          originalData: item, 
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

  // Function to fetch tax information by employee code
  const fetchTaxInformation = async (employeeCode, isEdit = false) => {
    try {
      if (isEdit) setEditLoading(true);
      else setViewLoading(true);
      const response = await axios.get(`/api/Employee/GetTaxInformation?employeeCode=${employeeCode}`);
      if (response.data.code === 0) {

        const mappedData = await mapApiDataToComponentFormat(response.data.data); // Chờ ánh xạ dữ liệu

        if (isEdit) {
          setEditData(mappedData);
          setIsEditModalVisible(true);
        } else {
          setViewData(mappedData);
          setIsViewModalVisible(true);
        }
      } else {
        message.error(response.data.message || 'Không thể tải thông tin thuế TNCN.');
      }
    } catch (error) {
      console.error('Error fetching tax information:', error);
      message.error('Có lỗi xảy ra khi tải thông tin thuế TNCN.');
    } finally {
      if (isEdit) setEditLoading(false);
      else setViewLoading(false);
    }
  };

  // Handle View action
  const handleView = (item) => {
    if (!canView) {
      message.error('Bạn không có quyền xem thông tin thuế TNCN.');
      return;
    }
    fetchTaxInformation(item.employeeId);
  };

  // Handle Edit action
  const handleEdit = (item) => {
    if (!canUpdate) {
      message.error('Bạn không có quyền chỉnh sửa thông tin thuế TNCN.');
      return;
    }
    fetchTaxInformation(item.employeeId, true);
  };

  // Handle Save action from Edit modal
  const handleEditSave = () => {
    setIsEditModalVisible(false);
    setEditData(null);
    fetchAllTaxData(); // Refresh table data after save
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
    { label: 'Đã có mã số thuế TNCN', key: 'hasTaxCode' },
    { label: 'Mã số thuế TNCN', key: 'taxCode' },
    {
      label: 'Số lượng người phụ thuộc',
      key: 'dependents',
    },
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

  // Handle Delete action
  const handleDelete = (item) => {
    if (!canDelete) {
      message.error('Bạn không có quyền xóa thông tin thuế TNCN.');
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
      const response = await axios.delete(`/api/Employee/DeleteTax/${selectedItem.employeeId}`);

      if (response.data.code === 0) {
        message.success(`Đã xóa thông tin thuế TNCN của ${selectedItem.fullName}`);
        fetchAllTaxData(); // Làm mới dữ liệu bảng sau khi xóa
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi xóa thông tin thuế TNCN.');
      }
    } catch (error) {
      console.error('Error deleting tax:', error);
      if (error.response) {
        const { status, data: errorData } = error.response;
        switch (status) {
          case 400:
            if (errorData.code === 1031) {
              message.error('Thông tin thuế TNCN không tồn tại.');
            } else {
              message.error(errorData.message || 'Yêu cầu không hợp lệ.');
            }
            break;
          case 401:
            message.error('Bạn không có quyền truy cập. Vui lòng đăng nhập lại.');
            break;
          case 403:
            message.error('Bạn không có quyền xóa thông tin thuế TNCN.');
            break;
          default:
            message.error('Có lỗi xảy ra khi xóa thông tin thuế TNCN.');
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
    <>
      <TableComponent
        data={taxData}
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
        emptyText="Chưa có dữ liệu thuế TNCN"
        canCreate={canCreate}
        canUpdate={canUpdate}
        canDelete={canDelete}
        canView={canView}
      />
      {/* View Modal */}
      <Modal
        title="Xem thông tin thuế TNCN"
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
          <CreateTax
            initialData={viewData}
            isViewMode={true}
            onCancel={handleViewModalClose}
            isModalFooter={true}
          />
        ) : null}
      </Modal>
      {/* Edit Modal */}
      <Modal
        title="Chỉnh sửa thông tin thuế TNCN"
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
          <CreateTax
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
      />
    </>
  );
};

export default HRTax;