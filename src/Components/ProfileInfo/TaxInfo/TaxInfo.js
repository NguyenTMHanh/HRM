import React, { useState, useEffect } from 'react';
import { Modal, Spin, message } from 'antd';
import Collapse from '../../../Shared/Collapse/Collapse';
import TaxInfo from './Section/TaxInfo';
import DependentInfo from './Section/Dependent';
import History from '../../../Shared/History/History';
import FooterBar from '../../Footer/Footer';
import CreateTax from '../../Create/CreateTax/CreateTax';
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

function TaxInfoProfile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const navigate = useNavigate();

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

  // Hàm gọi API lấy thông tin thuế TNCN
  const getTaxInformation = async (employeeCode) => {
    try {
      const response = await axios.get(`/api/Employee/GetTaxInformation?employeeCode=${employeeCode}`);
      if (response.data.code === 0) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to get tax information');
      }
    } catch (error) {
      console.error('Error getting tax information:', error);
      throw error;
    }
  };

  // Hàm format ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Hàm ánh xạ dữ liệu API sang định dạng component
  const mapApiDataToComponentFormat = (apiData) => {
    return {
      hasTax: apiData.hasTaxCode || false,
      taxCode: apiData.taxCode || '',
      fullName: `${apiData.employeeCode} - ${apiData.nameEmployee}`,
      gender: apiData.gender || '',
      dateOfBirth: apiData.dateOfBirth ? formatDate(apiData.dateOfBirth) : '',
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

  // Hàm chính để lấy dữ liệu thuế
  const fetchTaxData = async () => {
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

      // Bước 2: Lấy thông tin thuế bằng employeeCode
      const taxInfo = await getTaxInformation(employeeCode);

      // Bước 3: Ánh xạ dữ liệu API sang định dạng component
      const mappedData = mapApiDataToComponentFormat(taxInfo);

      setData(mappedData);
    } catch (error) {
      console.error('Error fetching tax data:', error);
      if (error.response) {
        const { status, data: errorData } = error.response;
        const errorCode = errorData?.code;

        switch (errorCode) {
          case 1022: // CustomCodes.EmployeeNotFound
            message.error('Không tìm thấy thông tin nhân viên. Vui lòng tạo hồ sơ thuế trước.');
            break;
          default:
            message.error(errorData?.message || 'Có lỗi xảy ra khi tải thông tin thuế.');
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
    fetchTaxData();
  }, []);

  const handleBack = () => {
    navigate('/infomation/insurance');
  };

  const handleEdit = () => {
    setIsModalVisible(true);
    setFormKey((prev) => prev + 1);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleSave = (updatedData) => {
    if (updatedData) {
      // Làm mới dữ liệu sau khi lưu
      fetchTaxData();
    }
    setIsModalVisible(false);
  };

  const historyItems = [
    {
      title: 'Cập nhật thông tin thuế',
      source: 'Người dùng',
      date: '10/04/2025',
    },
    {
      title: 'Thêm người phụ thuộc',
      source: 'Người dùng',
      date: '09/04/2025',
    },
    {
      title: 'Cập nhật mã số thuế',
      source: 'Người dùng',
      date: '08/04/2025',
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Đang tải thông tin thuế...</div>
      </div>
    );
  }

  if (!data && !loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '16px', color: '#666' }}>
          Chưa có thông tin thuế. Vui lòng tạo thông tin thuế trước.
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
                  header: 'Thông tin Thuế TNCN',
                  children: <TaxInfo {...data} />,
                }}
              />
            </div>
          </div>

          <div className="collapse-container">
            <div style={{ width: '100%' }}>
              <Collapse
                item={{
                  key: '2',
                  header: 'Thông tin người phụ thuộc',
                  children: <DependentInfo {...data} />,
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
                  key: '3',
                  header: 'Lịch sử hoạt động',
                  children: <History historyItems={historyItems} />,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <FooterBar
        showBack={true}
        onBack={handleBack}
        showEdit={true}
        onEdit={handleEdit}
      />

      <div style={{ position: 'relative' }}>
        <Modal
          title="Chỉnh sửa thông tin thuế"
          open={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
          width={1100}
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        >
          <CreateTax
            key={formKey}
            initialData={data}
            onSave={handleSave}
            isModalFooter={true}
          />
        </Modal>
      </div>
    </div>
  );
}

export default TaxInfoProfile;