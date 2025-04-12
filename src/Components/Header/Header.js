import React, { useState, useEffect } from 'react';
import { Layout, Button, Dropdown } from 'antd';
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

  // Định nghĩa menu dưới dạng mảng items
  const userMenuItems = [
    {
      key: 'username',
      label: username || 'Loading...',
      disabled: true,
      className: 'username-item',
    },
    {
      type: 'divider', // Tương ứng với Menu.Divider
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
          menu={{ items: userMenuItems }} // Sử dụng menu thay vì overlay
          trigger={["click"]}
        >
          <Button className="icon-btn"><UserOutlined /></Button>
        </Dropdown>
      </div>
    </Header>
  );
}

export default HeaderBar;