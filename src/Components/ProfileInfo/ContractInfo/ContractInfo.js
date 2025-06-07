import React, { useState, useEffect } from 'react';
import { Modal, Spin, message } from 'antd';
import Collapse from '../../../Shared/Collapse/Collapse';
import ContractInfo from './Section/ContractInfo';
import AllowanceInfo from './Section/AllowanceInfo';
import History from '../../../Shared/History/History';
import BasicInfo from './Section/BasicInfo';
import FooterBar from '../../Footer/Footer';
import CreateContract from '../../Create/CreateContract/CreateContract';
import { useNavigate } from 'react-router-dom';
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

function ContractInfoProfile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [permissions, setPermissions] = useState([]);
  const navigate = useNavigate();

  // Fetch permissions from localStorage
  useEffect(() => {
    const storedPermissions = JSON.parse(localStorage.getItem('permissions')) || [];
    setPermissions(storedPermissions);
  }, []);

  // Permission check for update action
  const canUpdate = permissions.some(
    (p) => p.moduleId === 'allModule' && p.actionId === 'fullAuthority'
  ) || permissions.some(
    (p) => p.moduleId === 'profileContract' && p.actionId === 'update'
  );

  // Hàm lấy employeeCode từ userId
  const getEmployeeCode = async (userId) => {
    try {
      const response = await axios.get(`/api/Employee/GetEmployeeCodeToUserId?userId=${userId}`);
      if (response.data.code === 0) {
        return response.data.data; // employeeCode
      } else {
        throw new Error(response.data.message || 'Failed to get employee code');
      }
    } catch (error) {
      console.error('Error getting employee code:', error);
      throw error;
    }
  };

  // Hàm gọi API lấy thông tin hợp đồng
  const getContractInformation = async (employeeCode) => {
    try {
      const response = await axios.get(`/api/Employee/GetContractInformation?employeeCode=${employeeCode}`);
      if (response.data.code === 0) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to get contract information');
      }
    } catch (error) {
      console.error('Error getting contract information:', error);
      throw error;
    }
  };

  // Hàm format ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Hàm format tiền tệ VNĐ
  const formatCurrency = (amount) => {
    if (!amount) return '0 VNĐ';
    return `${amount.toLocaleString('vi-VN')} VNĐ`;
  };

  // Hàm format loại hợp đồng sang tiếng Việt
  const formatContractType = (type) => {
    if (!type) return '';
    switch (type) {
      case 'NoLimitedContract':
        return 'HĐLĐ không xác định thời hạn';
      case 'FixedTermContract':
        return 'HĐLĐ xác định thời hạn';
      default:
        return type;
    }
  };

  const formatGender = (gender) => {
    if (!gender) return '';
    return gender.toLowerCase() === 'female' ? 'Nữ' :
      gender.toLowerCase() === 'male' ? 'Nam' : gender;
  };

  // Hàm format trạng thái hợp đồng
  const formatContractStatus = (status) => {
    if (!status) return '';
    return status.toLowerCase() === 'valid' ? 'Còn hiệu lực' : 'Hết hiệu lực';
  };

  // Hàm ánh xạ dữ liệu API sang định dạng component
  const mapApiDataToComponentFormat = (apiData) => {
    return {
      employeeCode: apiData.employeeCode || " ",
      fullName: apiData.nameEmployee || " ",
      gender: formatGender(apiData.gender),
      dateOfBirth: formatDate(apiData.dateOfBirth),
      contractId: apiData.codeContract || " ",
      contractType: formatContractType(apiData.typeContract),
      startDate: formatDate(apiData.startContract),
      endDate: formatDate(apiData.endContract),
      status: formatContractStatus(apiData.statusContract),
      hourlyWage: formatCurrency(apiData.hourlySalary),
      workHoursPerDay: apiData.hourWorkStandard ? `${apiData.hourWorkStandard} giờ` : " ",
      position: apiData.namePosition || " ",
      salaryCoefficient: apiData.coefficientSalary?.toString() || " ",
      standardWorkingDays: apiData.dayWorkStandard?.toString() || " ",
      basicSalary: formatCurrency(apiData.basicSalary),
      allowances: apiData.allowances?.map(allowance => ({
        name: allowance.nameAllowance,
        amount: formatCurrency(allowance.moneyAllowance),
      })) || [],
    };
  };

  // Hàm chính để lấy dữ liệu hợp đồng
  const fetchContractData = async () => {
    try {
      setLoading(true);

      // Lấy userId từ localStorage
      const userId = localStorage.getItem('userId');
      if (!userId) {
        message.error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
        return;
      }

      // Bước 1: Lấy employeeCode từ userId
      const employeeCode = await getEmployeeCode(userId);

      // Bước 2: Lấy thông tin hợp đồng bằng employeeCode
      const contractInfo = await getContractInformation(employeeCode);

      // Bước 3: Ánh xạ dữ liệu API sang định dạng component
      const mappedData = mapApiDataToComponentFormat(contractInfo);

      setData(mappedData);
    } catch (error) {
      console.error('Error fetching contract data:', error);

      // Xử lý lỗi cụ thể
      if (error.response) {
        const { status, data: errorData } = error.response;
        const errorCode = errorData?.code;

        switch (errorCode) {
          case 1022: // CustomCodes.EmployeeNotFound
            break;
          default:
            message.error(errorData?.message || 'Có lỗi xảy ra khi tải thông tin hợp đồng.');
            break;
        }
      } else {
        message.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractData();
  }, []);

  const handleNext = () => {
    navigate('/infomation/insurance');
  };

  const handleBack = () => {
    navigate('/infomation/personel');
  };

  const handleEdit = () => {
    if (!canUpdate) {
      message.error('Bạn không có quyền chỉnh sửa thông tin hợp đồng.');
      return;
    }
    setIsModalVisible(true);
    setFormKey(prev => prev + 1);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleSave = (updatedData) => {
    if (updatedData) {
      // Làm mới dữ liệu sau khi lưu
      fetchContractData();
    }
    setIsModalVisible(false);
  };

  const historyItems = [
    {
      title: 'Cập nhật thông tin hợp đồng',
      source: 'Người dùng',
      date: '10/04/2025',
    },
    {
      title: 'Thay đổi phụ cấp',
      source: 'Người dùng',
      date: '09/04/2025',
    },
    {
      title: 'Thêm thông tin hợp đồng',
      source: 'Người dùng',
      date: '08/04/2025',
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Đang tải thông tin hợp đồng...</div>
      </div>
    );
  }

  if (!data && !loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '0.875rem', color: '#666' }}>
          Chưa có thông tin hợp đồng. Vui lòng tạo hợp đồng trước.
        </div>
      </div>
    );
  }

  return (
    <div className="scroll-container">
      <div className="main-content">
        <div className="left-column">
          <div className="collapse-container">
            <div style={{ width: '100%' }}>
              <Collapse
                item={{
                  key: '1',
                  header: 'Thông tin cơ bản',
                  children: <BasicInfo {...data} />,
                }}
              />
            </div>
          </div>
          <div className="collapse-container">
            <div style={{ width: '100%' }}>
              <Collapse
                item={{
                  key: '2',
                  header: 'Thông tin HĐLĐ',
                  children: <ContractInfo {...data} />,
                }}
              />
            </div>
          </div>
          <div className="collapse-container">
            <div style={{ width: '100%' }}>
              <Collapse
                item={{
                  key: '3',
                  header: 'Thông tin phụ cấp',
                  children: <AllowanceInfo {...data} />,
                }}
              />
            </div>
          </div>
        </div>

        <div className="right-column">
          <div className="collapse-container">
            <div style={{ width: '100%' }}>
              <Collapse
                item={{
                  key: '6',
                  header: 'Lịch sử hoạt động',
                  children: <History historyItems={historyItems} />,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <FooterBar
        showNext={true}
        onNext={handleNext}
        showBack={true}
        onBack={handleBack}
        showEdit={canUpdate} // Only show Edit button if user has update permission
        onEdit={handleEdit}
      />

      <div style={{ position: 'relative' }}>
        <Modal
          title="Chỉnh sửa thông tin hợp đồng"
          open={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
          width={1000}
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        >
          <CreateContract
            key={formKey}
            initialData={data}
            onSave={handleSave}
            onCancel={handleModalClose}
            isModalFooter={true}
          />
        </Modal>
      </div>
    </div>
  );
}

export default ContractInfoProfile;