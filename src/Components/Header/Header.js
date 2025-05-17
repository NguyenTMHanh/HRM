import React, { useState, useEffect } from 'react';
import { Layout, Button, Dropdown } from 'antd';
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
import './styles.css';

const { Header } = Layout;

function HeaderBar({ collapsed, toggleCollapse }) {
  const [username, setUsername] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = { data: { username: 'Nguyenthimyhanh' } }; 
        setUsername(response.data.username);
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchUsername();
  }, []);


  const handleMenuClick = ({ key }) => {
    if (key === '1') {
      navigate('/infomation/personal'); 
    } else if (key === '2') {
      console.log('Change Password clicked');
    } else if (key === '3') {
      navigate('/login'); 
    }
  };

  const userMenuItems = [
    {
      key: 'username',
      label: username || 'Loading...',
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
    <Header className="header-bar">
      <Button className="toggle-btn" onClick={toggleCollapse}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <div className="header-right">
        <Button className="icon-btn"><BellOutlined /></Button>
        <Dropdown
          menu={{ 
            items: userMenuItems,
            onClick: handleMenuClick // Add onClick handler
          }} 
          trigger={["click"]}
        >
          <Button className="icon-btn"><UserOutlined /></Button>
        </Dropdown>
      </div>
    </Header>
  );
}

export default HeaderBar;