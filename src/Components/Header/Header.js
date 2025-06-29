import React, { useState, useEffect } from 'react';
import { Layout, Button, Dropdown, message, Modal } from 'antd';
import { useNavigate } from 'react-router-dom'; 
import { 
  MenuUnfoldOutlined, 
  MenuFoldOutlined, 
  BellOutlined, 
  UserOutlined,
  UserSwitchOutlined, 
  LockOutlined,      
  LogoutOutlined    
} from '@ant-design/icons';
import axios from 'axios';
import ChangePassword from '../Auth/ChangePassword';
import './styles.css';

const { Header } = Layout;

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

function HeaderBar({ collapsed, toggleCollapse }) {
  const [userName, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('/default-avatar.png'); // Default avatar
  const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false); // State cho dialog
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          message.error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
          return;
        }

        const response = await axios.get(`/api/Account/GetInfoAccount?userId=${userId}`);
        
        if (response.data.code === 0) {
          const { userName, avatarPath } = response.data.data;          
          setUsername(userName);

          if (avatarPath) {
            const avatarResponse = await axios.get(`/api/FileUpload/GetFile/${avatarPath}`, {
              responseType: 'blob'
            });
            const imageUrl = URL.createObjectURL(avatarResponse.data);
            setAvatarUrl(imageUrl);
          }
        } else {
          message.error(response.data.message || 'Không thể lấy thông tin tài khoản.');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        if (error.response) {
          const { status, data } = error.response;
          if (status === 400 && data.code === 1009) {
            message.error('Không tìm thấy người dùng.');
          } else {
            message.error('Có lỗi xảy ra khi lấy thông tin tài khoản.');
          }
        } else {
          message.error('Không thể kết nối đến server.');
        }
      }
    };

    fetchUserInfo();

    return () => {
      if (avatarUrl !== '/default-avatar.png') {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, [avatarUrl]);

  const handleMenuClick = ({ key }) => {
    if (key === '1') {
      navigate('/infomation/personal'); 
    } else if (key === '2') {
      setIsChangePasswordVisible(true); // Mở dialog ChangePassword
    } else if (key === '3') {
      navigate('/login'); 
    }
  };

  const handleCloseModal = () => {
    setIsChangePasswordVisible(false); // Đóng dialog
  };

  const userMenuItems = [
    {
      key: 'username',
      label: userName ? `Tài khoản: ${userName}` : 'Loading...',
      disabled: true,
      className: 'username-item',
    },
    {
      type: 'divider', 
    },
    {
      key: '1',
      label: 'Profile',
      icon: <UserSwitchOutlined className="menu-icon" />,
    },
    {
      key: '2',
      label: 'Thay đổi mật khẩu',
      icon: <LockOutlined className="menu-icon" />,
    },
    {
      key: '3',
      label: 'Đăng xuất',
      icon: <LogoutOutlined className="menu-icon logout-icon" />,
      className: 'logout-item',
    },
  ];

  return (
    <>
      <Header className="header-bar">
        <Button className="toggle-btn" onClick={toggleCollapse}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
        <div className="header-right">
          <Button className="icon-btn"><BellOutlined /></Button>
          <Dropdown
            menu={{ 
              items: userMenuItems,
              onClick: handleMenuClick
            }} 
            trigger={["click"]}
          >
            <Button className="icon-btn">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="User avatar"
                  style={{ 
                    width: '30px', 
                    height: '30px', 
                    borderRadius: '50%', 
                    objectFit: 'cover',
                    border: '1px solid #d9d9d9',
                    backgroundColor: '#f5f5f5',
                    verticalAlign: 'middle'
                  }}
                  onError={(e) => {
                    e.target.src = '/default-avatar.png';
                  }}
                />
              ) : (
                <UserOutlined />
              )}
            </Button>
          </Dropdown>
        </div>
      </Header>

      <Modal
        title="Thay đổi mật khẩu"
        open={isChangePasswordVisible}
        onCancel={handleCloseModal}
        footer={null}
        destroyOnClose
      >
        <ChangePassword onSuccess={handleCloseModal} />
      </Modal>
    </>
  );
}

export default HeaderBar;