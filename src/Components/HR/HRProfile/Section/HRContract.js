import React, { useState, useEffect } from 'react';
import { message, Spin, Modal } from 'antd';
import TableComponent from '../../../../Shared/Table/Table';
import Status from '../../../../Shared/Status/Status';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateContract from '../../../Create/CreateContract/CreateContract';

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
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // Load permissions from localStorage
  useEffect(() => {
    const storedPermissions = JSON.parse(localStorage.getItem('permissions')) || [];
    setPermissions(storedPermissions);
  }, []);

  // Permission checks
  const canUpdate = permissions.some(
    (p) => p.moduleId === 'allModule' && p.actionId === 'fullAuthority'
  ) || permissions.some(
    (p) => p.moduleId === 'profileContract' && p.actionId === 'update'
  );

  const canDelete = permissions.some(
    (p) => p.moduleId === 'allModule' && p.actionId === 'fullAuthority'
  ) || permissions.some(
    (p) => p.moduleId === 'profileContract' && p.actionId === 'delete'
  );

  const canCreate = permissions.some(
    (p) => p.moduleId === 'allModule' && p.actionId === 'fullAuthority'
  ) || permissions.some(
    (p) => p.moduleId === 'profileContract' && p.actionId === 'create'
  );

  const canView = permissions.some(
    (p) => p.moduleId === 'allModule' && p.actionId === 'fullAuthority'
  ) || permissions.some(
    (p) => p.moduleId === 'profileContract' && p.actionId === 'view'
  );

  // Function to get image URL from file ID (avatar)
  const getImageUrl = (fileId) => {
    if (!fileId) return '/default-avatar.png';
    return `${axios.defaults.baseURL}/api/FileUpload/GetFile/${fileId}`;
  };

  // Function to format date from API response
  const formatDate = (dateString) => {
    if (!dateString || dateString === '0001-01-01T00:00:00Z') return '';
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

  // Function to format numbers with spaces
  const formatWithSpaces = (number) => {
    if (number == null) return '';
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  // Function to map API data to component format
  const mapApiDataToComponentFormat = (apiData) => {
    return {
      employeeCode: apiData.employeeCode || '',
      fullName: `${apiData.employeeCode} - ${apiData.nameEmployee || ''}`,
      gender: apiData.gender === 'Female' ? 'Nữ' : apiData.gender === 'Male' ? 'Nam' : '',
      dateOfBirth: formatDate(apiData.dateOfBirth),
      contractId: apiData.contractCode || '',
      contractType: formatContractType(apiData.typeContract),
      startDate: formatDate(apiData.startContract),
      endDate: formatDate(apiData.endContract),
      status: formatContractStatus(apiData.statusContract),
      hourlyWage: apiData.hourlySalary ? `${formatWithSpaces(apiData.hourlySalary)} VNĐ` : '',
      workHoursPerDay: apiData.hourWorkStandard ? `${apiData.hourWorkStandard} giờ/ngày` : '',
      position: apiData.positionName || '',
      salaryCoefficient: apiData.coefficientSalary != null ? apiData.coefficientSalary.toString() : '',
      standardWorkingDays: apiData.dayWorkStandard ? `${apiData.dayWorkStandard} ngày` : '',
      basicSalary: apiData.basicSalary ? `${formatWithSpaces(apiData.basicSalary)} VNĐ` : '',
      allowances: apiData.allowances?.map(allowance => ({
        name: allowance.nameAllowance,
        amount: allowance.moneyAllowance ? `${formatWithSpaces(allowance.moneyAllowance)} VNĐ` : ''
      })) || [],
    };
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
          hourlyRate: item.hourlySalary ? `${formatWithSpaces(item.hourlySalary)} VNĐ` : '',
          standardHoursPerDay: item.hourWorkStandard ? `${item.hourWorkStandard} giờ/ngày` : '',
          salaryCoefficient: item.coefficientSalary != null ? item.coefficientSalary : '',
          validFrom: formatDate(item.startContract),
          validTo: formatDate(item.endContract),
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

  // Function to fetch contract information by employee code
  const fetchContractInformation = async (employeeCode, isEdit = false) => {
    try {
      if (isEdit) setEditLoading(true);
      else setViewLoading(true);
      const response = await axios.get(`/api/Employee/GetContractInformation?employeeCode=${employeeCode}`);
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
        message.error(response.data.message || 'Không thể tải thông tin hợp đồng.');
      }
    } catch (error) {
      console.error('Error fetching contract information:', error);
      message.error('Có lỗi xảy ra khi tải thông tin hợp đồng.');
    } finally {
      if (isEdit) setEditLoading(false);
      else setViewLoading(false);
    }
  };

  // Handle View action
  const handleView = (item) => {
    if (!canView) {
      message.error('Bạn không có quyền xem thông tin hợp đồng.');
      return;
    }
    fetchContractInformation(item.employeeId);
  };

  // Handle Edit action
  const handleEdit = (item) => {
    if (!canUpdate) {
      message.error('Bạn không có quyền chỉnh sửa thông tin hợp đồng.');
      return;
    }
    fetchContractInformation(item.employeeId, true);
  };

  // Handle Save action from Edit modal
  const handleEditSave = () => {
    setIsEditModalVisible(false);
    setEditData(null);
    fetchAllContractData(); // Refresh table data after save
  };

  // Handle Delete action
  const handleDelete = async (item) => {
    if (!canDelete) {
      message.error('Bạn không có quyền xóa thông tin hợp đồng.');
      return;
    }

    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa hợp đồng ${item.contractId} của ${item.name}?`);
    if (!confirmed) return;

    try {
      const response = await axios.delete(`/api/Employee/DeleteContract/${item.contractId}`);
      if (response.data.code === 0) {
        message.success(`Đã xóa hợp đồng ${item.contractId}`);
        fetchAllContractData();
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi xóa hợp đồng.');
      }
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

  const handleViewModalClose = () => {
    setIsViewModalVisible(false);
    setViewData(null);
  };

  const handleEditModalClose = () => {
    setIsEditModalVisible(false);
    setEditData(null);
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
              e.target.src = '/default-avatar.png';
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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Đang tải dữ liệu hợp đồng...</div>
      </div>
    );
  }

  return (
    <>
      <TableComponent
        data={contractData}
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
        emptyText="Chưa có dữ liệu hợp đồng"
        canCreate={canCreate}
        canUpdate={canUpdate}
        canDelete={canDelete}
        canView={canView}
      />
      {/* View Modal */}
      <Modal
        title="Xem thông tin hợp đồng"
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
          <CreateContract
            initialData={viewData}
            isViewMode={true}
            onCancel={handleViewModalClose}
            isModalFooter={true}
          />
        ) : null}
      </Modal>
      {/* Edit Modal */}
      <Modal
        title="Chỉnh sửa thông tin hợp đồng"
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
          <CreateContract
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

export default HRContract;