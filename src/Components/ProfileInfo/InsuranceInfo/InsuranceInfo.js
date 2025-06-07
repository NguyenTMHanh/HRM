import React, { useState, useEffect } from 'react';
import { Modal, Spin, message } from 'antd';
import Collapse from '../../../Shared/Collapse/Collapse';
import BHYTInfo from './Section/BHYTInfo';
import BHXHInfo from './Section/BHXHInfo';
import BHTNInfo from './Section/BHTNInfo';
import GeneralInfo from './Section/GeneralInfo';
import BasicInfo from './Section/BasicInfo';
import History from '../../../Shared/History/History';
import FooterBar from '../../Footer/Footer';
import CreateInsurance from '../../Create/CreateInsurance/CreateInsurance';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

// Axios configuration (giả sử đã được cấu hình toàn cục)
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

function InsuranceInfoProfile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const navigate = useNavigate();

  // Hàm lấy employeeCode từ userId (tái sử dụng từ PersonelInfoProfile)
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

  // Hàm gọi API lấy thông tin bảo hiểm
  const getInsuranceInformation = async (employeeCode) => {
    try {
      const response = await axios.get(`/api/Employee/GetInsuranceInformation?employeeCode=${employeeCode}`);
      if (response.data.code === 0) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to get insurance information');
      }
    } catch (error) {
      console.error('Error getting insurance information:', error);
      throw error;
    }
  };

  // Hàm format ngày tháng
  const formatDate = (dateString) => {
    if (!dateString || dateString === '0001-01-01T00:00:00') return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Hàm format tỷ lệ bảo hiểm
  const formatInsuranceRate = (employeeRate, businessRate) => {
    if (!employeeRate && !businessRate) return '';
    return `${employeeRate}% NLĐ / ${businessRate}% DN`;
  };

  // Hàm format trạng thái bảo hiểm
  const formatInsuranceStatus = (status) => {
    if (!status) return '';
    return status; // Trạng thái đã được API trả về tiếng Việt
  };

  // Hàm format tình trạng tham gia BHXH
  const formatHasJoined = (hasJoined) => {
    return hasJoined ? 'Có tham gia' : 'Không tham gia';
  };

  const formatGender = (gender) => {
    if (!gender) return '';
    return gender.toLowerCase() === 'female' ? 'Nữ' :
      gender.toLowerCase() === 'male' ? 'Nam' : gender;
  };

  // Hàm ánh xạ dữ liệu API sang định dạng component
  const mapApiDataToComponentFormat = (apiData) => {

    return {
      employeeCode: apiData.employeeCode || " ",
      fullName: apiData.nameEmployee || " ",
      gender: formatGender(apiData.gender),
      dateOfBirth: formatDate(apiData.dateOfBirth),
      bhytCode: apiData.codeBHYT || "",
      bhytRate: formatInsuranceRate(apiData.rateBHYTEmpt, apiData.rateBHYTBussiness) || "",
      registeredHospital: apiData.registerMedical || "",
      bhytStartDate: formatDate(apiData.dateStartParticipateBHYT) || "",
      hasJoined: formatHasJoined(apiData.hasBHXH) || "",
      bhxhCode: apiData.codeBHXH || "",
      bhxhRate: formatInsuranceRate(apiData.rateBHXHEmpt, apiData.rateBHXHBussiness) || "",
      bhxhStartDate: formatDate(apiData.dateStartParticipateBHXH) || "",
      bhtnRate: formatInsuranceRate(apiData.rateBHTNEmpt, apiData.rateBHTNBussiness) || "",
      bhtnStartDate: formatDate(apiData.dateStartParticipateBHTN) || "",
      bhStatus: formatInsuranceStatus(apiData.insuranceStatus) || "",
      bhEndDate: formatDate(apiData.dateEndParticipateInsurance) || "",
    };
  };

  // Hàm chính để lấy dữ liệu bảo hiểm
  const fetchInsuranceData = async () => {
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

      // Bước 2: Lấy thông tin bảo hiểm bằng employeeCode
      const insuranceInfo = await getInsuranceInformation(employeeCode);

      // Bước 3: Ánh xạ dữ liệu API sang định dạng component
      const mappedData = mapApiDataToComponentFormat(insuranceInfo);

      setData(mappedData);
    } catch (error) {
      console.error('Error fetching insurance data:', error);

      // Xử lý lỗi cụ thể
      if (error.response) {
        const { status, data: errorData } = error.response;
        const errorCode = errorData?.code;

        switch (errorCode) {
          case 1022: // CustomCodes.EmployeeNotFound
            break;
          default:
            message.error(errorData?.message || 'Có lỗi xảy ra khi tải thông tin bảo hiểm.');
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
    fetchInsuranceData();
  }, []);

  const handleNext = () => {
    navigate('/infomation/tax');
  };

  const handleBack = () => {
    navigate('/infomation/contract');
  };

  const handleEdit = () => {
    setIsModalVisible(true);
    setFormKey(prev => prev + 1);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleSave = (updatedData) => {
    if (updatedData) {
      // Làm mới dữ liệu sau khi lưu
      fetchInsuranceData();
    }
    setIsModalVisible(false);
  };

  const historyItems = [
    {
      title: 'Cập nhật thông tin bảo hiểm',
      source: 'Người dùng',
      date: '10/04/2025',
    },
    {
      title: 'Thay đổi mã BHYT',
      source: 'Người dùng',
      date: '09/04/2025',
    },
    {
      title: 'Thêm thông tin BHXH',
      source: 'Người dùng',
      date: '08/04/2025',
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Đang tải thông tin bảo hiểm...</div>
      </div>
    );
  }

  if (!data && !loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '0.875rem', color: '#666' }}>
          Chưa có thông tin bảo hiểm. Vui lòng tạo thông tin bảo hiểm trước.
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
                  header: 'Thông tin BHYT',
                  children: <BHYTInfo {...data} />,
                }}
              />
            </div>
          </div>

          <div className="collapse-container">
            <div style={{ width: '100%' }}>
              <Collapse
                item={{
                  key: '3',
                  header: 'Thông tin BHXH',
                  children: <BHXHInfo {...data} />,
                }}
              />
            </div>
          </div>

          <div className="collapse-container">
            <div style={{ width: '100%' }}>
              <Collapse
                item={{
                  key: '4',
                  header: 'Thông tin BHTN',
                  children: <BHTNInfo {...data} />,
                }}
              />
            </div>
          </div>

          <div className="collapse-container">
            <div style={{ width: '100%' }}>
              <Collapse
                item={{
                  key: '5',
                  header: 'Thông tin BH chung',
                  children: <GeneralInfo {...data} />,
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
        showEdit={true}
        onEdit={handleEdit}
      />

      <div style={{ position: 'relative' }}>
        <Modal
          title="Chỉnh sửa thông tin bảo hiểm"
          open={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
          width={1000}
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        >
          <CreateInsurance
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

export default InsuranceInfoProfile;