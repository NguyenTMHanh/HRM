import React, { useState, useEffect } from 'react';
import { Modal, Spin, message } from 'antd';
import Collapse from '../../../Shared/Collapse/Collapse';
import WorkInfo from './Section/WorkInfo';
import History from '../../../Shared/History/History';
import BasicInfo from './Section/BasicInfo';
import FooterBar from '../../Footer/Footer';
import CreatePersonel from '../../Create/CreatePersonel/CreatePersonel';
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

function PersonelInfoProfile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState([]);
  useEffect(() => {
    const storedPermissions = JSON.parse(localStorage.getItem('permissions')) || [];
    setPermissions(storedPermissions);
  }, []);

  // Permission check for update action
  const canUpdate = permissions.some(
    (p) => p.moduleId === 'allModule' && p.actionId === 'fullAuthority'
  ) || permissions.some(
    (p) => p.moduleId === 'profilePersonel' && p.actionId === 'update'
  );
  // Function to get employee code from userId (reuse from PersonalInfoProfile)
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

  // Function to get personnel information
  const getPersonelInformation = async (employeeCode) => {
    try {
      const response = await axios.get(`/api/Employee/GetPersonelInformation?employeeCode=${employeeCode}`);
      if (response.data.code === 0) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to get personnel information');
      }
    } catch (error) {
      console.error('Error getting personnel information:', error);
      throw error;
    }
  };

  // Function to get image URL from file ID (avatar)
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

  // Function to format gender from English to Vietnamese
  const formatGender = (gender) => {
    if (!gender) return '';
    return gender.toLowerCase() === 'female' ? 'Nữ' :
      gender.toLowerCase() === 'male' ? 'Nam' : gender;
  };

  // Function to format lunch break hours
  const formatLunchBreak = (hours) => {
    if (!hours) return '';
    return `${hours} giờ`;
  };

  // Function to map API data to component format
  const mapApiDataToComponentFormat = (apiData) => {
    return {
      employeeCode: apiData.employeeCode || " ",
      fullName: apiData.nameEmployee || " ",
      gender: formatGender(apiData.gender),
      dateOfBirth: formatDate(apiData.dateOfBirth),
      joinDate: formatDate(apiData.dateJoinCompany),
      department: apiData.departmentName || " ",
      jobTitle: apiData.jobtitleName || " ",
      level: apiData.rankName || " ",
      position: apiData.positionName || " ",
      managedBy: apiData.managerName || " ",
      workLocation: apiData.branchName || " ",
      workMode: apiData.jobTypeName || " ",
      lunchBreak: formatLunchBreak(apiData.breakLunch),
      avatarUrl: getImageUrl(apiData.avatarPath),
      roleGroup: apiData.roleName || " ",
    };
  };

  // Main function to fetch personnel data
  const fetchPersonelData = async () => {
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

      // Step 2: Get personnel information using employee code
      const personelInfo = await getPersonelInformation(employeeCode);

      // Step 3: Map API data to component format
      const mappedData = mapApiDataToComponentFormat(personelInfo);

      setData(mappedData);
    } catch (error) {
      console.error('Error fetching personnel data:', error);

      // Handle specific error codes
      if (error.response) {
        const { status, data: errorData } = error.response;
        const errorCode = errorData?.code;

        switch (errorCode) {
          case 1022: // CustomCodes.EmployeeNotFound
            break;
          default:
            message.error(errorData?.message || 'Có lỗi xảy ra khi tải thông tin nhân sự.');
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
    fetchPersonelData();
  }, []);

  const handleNext = () => {
    navigate('/infomation/contract');
  };

  const handleBack = () => {
    navigate('/infomation/personal');
  };

  const handleEdit = () => {
    if (!canUpdate) {
      message.error('Bạn không có quyền chỉnh sửa thông tin nhân sự.');
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
      // Refresh data after save
      fetchPersonelData();
    }
    setIsModalVisible(false);
  };

  const historyItems = [
    {
      title: 'Cập nhật thông tin công việc',
      source: 'Người dùng',
      date: '10/04/2025',
    },
    {
      title: 'Thay đổi thông tin tài khoản',
      source: 'Người dùng',
      date: '09/04/2025',
    },
    {
      title: 'Thêm thông tin nhân sự',
      source: 'Người dùng',
      date: '08/04/2025',
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Đang tải thông tin nhân sự...</div>
      </div>
    );
  }

  // If no data and not loading, show message
  if (!data && !loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '0.875rem', color: '#666' }}>
          Chưa có thông tin nhân sự. Vui lòng tạo hồ sơ nhân sự trước.
        </div>
      </div>
    );
  }

  return (
    <div className="scroll-container">
      <div className="main-content">
        <div className="left-column">

          <div className="collapse-container">
            <Collapse
              item={{
                key: '1',
                header: 'Thông tin cơ bản',
                children: <BasicInfo {...data} />,
              }}
            />
          </div>
          <div className="collapse-container">
            <Collapse
              item={{
                key: '2',
                header: 'Thông tin công việc',
                children: <WorkInfo {...data} />,
              }}
            />
          </div>

        </div>

        <div className="right-column">
          <div className="collapse-container">
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

      <FooterBar
        showNext={true}
        onNext={handleNext}
        showBack={true}
        onBack={handleBack}
        showEdit={canUpdate}
        onEdit={handleEdit}
      />

      <div style={{ position: 'relative' }}>
        <Modal
          title="Chỉnh sửa thông tin nhân sự"
          open={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
          width={1000}
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        >
          <CreatePersonel
            key={formKey}
            initialData={data}
            onSave={handleSave}
            onCancel={handleModalClose}
            isModalFooter={true}
             isEditMode={true} 
          />
        </Modal>
      </div>
    </div>
  );
}

export default PersonelInfoProfile;