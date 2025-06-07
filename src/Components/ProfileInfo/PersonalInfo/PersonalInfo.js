import React, { useState, useEffect } from 'react';
import { Modal, Spin, message } from 'antd';
import PersonalInfo from './Section/PersonalInfo';
import Identification from './Section/Identification';
import ResidentInfo from './Section/ResidentInfo';
import ContactInfo from './Section/ContactInfo';
import BankInfo from './Section/BankInfo';
import Collapse from '../../../Shared/Collapse/Collapse';
import History from '../../../Shared/History/History';
import { useNavigate } from 'react-router-dom';
import FooterBar from '../../Footer/Footer';
import CreatePersonal from '../../Create/CreatePersonal/CreatePersonal';
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

function PersonalInfoProfile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/infomation/personel');
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
      // Refresh data after save
      fetchPersonalData();
    }
    setIsModalVisible(false);
  };

  // Function to get employee code from userId
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

  // Function to get personal information
  const getPersonalInformation = async (employeeCode) => {
    try {
      const response = await axios.get(`/api/Employee/GetPersonalInformation?employeeCode=${employeeCode}`);
      if (response.data.code === 0) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to get personal information');
      }
    } catch (error) {
      console.error('Error getting personal information:', error);
      throw error;
    }
  };

  // Function to get image URL from file ID
  const getImageUrl = (fileId) => {
    if (!fileId) return null;
    return `${axios.defaults.baseURL}/api/FileUpload/GetFile/${fileId}`;
  };

  // Function to format date from API response
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
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
    };
  };

  // Main function to fetch personal data
  const fetchPersonalData = async () => {
    try {
      setLoading(true);
      
      // Get userId from localStorage (assuming it's stored after login)
      const userId = localStorage.getItem('userId');
      if (!userId) {
        message.error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
        return;
      }

      // Step 1: Get employee code from userId
      const employeeCode = await getEmployeeCode(userId);
      
      // Step 2: Get personal information using employee code
      const personalInfo = await getPersonalInformation(employeeCode);
      
      // Step 3: Map API data to component format
      const mappedData = mapApiDataToComponentFormat(personalInfo);
      
      setData(mappedData);
    } catch (error) {
      console.error('Error fetching personal data:', error);
      
      // Handle specific error codes
      if (error.response) {
        const { status, data: errorData } = error.response;
        const errorCode = errorData?.code;
        
        switch (errorCode) {
          case 1022: // CustomCodes.EmployeeNotFound
            message.error('Không tìm thấy thông tin nhân viên. Vui lòng tạo hồ sơ cá nhân trước.');
            break;
          default:
            message.error(errorData?.message || 'Có lỗi xảy ra khi tải thông tin cá nhân.');
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
    fetchPersonalData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Đang tải thông tin cá nhân...</div>
      </div>
    );
  }

  // If no data and not loading, show message
  if (!data && !loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '16px', color: '#666' }}>
          Chưa có thông tin cá nhân. Vui lòng tạo hồ sơ cá nhân trước.
        </div>
      </div>
    );
  }

  const historyItems = [
    {
      title: 'Cập nhật thông tin cá nhân',
      source: 'Người dùng',
      date: '10/04/2025',
    },
    {
      title: 'Thay đổi thông tin liên hệ',
      source: 'Người dùng',
      date: '09/04/2025',
    },
    {
      title: 'Thêm tài khoản ngân hàng',
      source: 'Người dùng',
      date: '08/04/2025',
    },
  ];

  return (
    <div className="scroll-container">
      <div className="main-content">
        <div className="left-column">
          <div className="collapse-container">
            <Collapse
              item={{
                key: '1',
                header: 'Thông tin cá nhân',
                children: <PersonalInfo {...data} />,
              }}
            />
          </div>
          <div className="collapse-container">
            <Collapse
              item={{
                key: '2',
                header: 'Ảnh chụp CCCD/CMND',
                children: <Identification {...data} />,
              }}
            />
          </div>
          <div className="collapse-container">
            <Collapse
              item={{
                key: '3',
                header: 'Thông tin thường trú',
                children: <ResidentInfo {...data} />,
              }}
            />
          </div>
          <div className="collapse-container">
            <Collapse
              item={{
                key: '4',
                header: 'Thông tin liên hệ',
                children: <ContactInfo {...data} />,
              }}
            />
          </div>
          <div className="collapse-container">
            <Collapse
              item={{
                key: '5',
                header: 'Thông tin tài khoản ngân hàng',
                children: <BankInfo {...data} />,
              }}
            />
          </div>
        </div>

        <div className="right-column">
          <div className="collapse-container">
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

      <FooterBar showNext={true} onNext={handleNext} showEdit={true} onEdit={handleEdit} />

      <div style={{ position: 'relative' }}>
        <Modal
          title="Chỉnh sửa thông tin cá nhân"
          open={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
          width={1000}
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        >
          <CreatePersonal
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

export default PersonalInfoProfile;