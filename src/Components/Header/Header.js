import React, { useState, useEffect } from 'react';
import { Layout, Button, theme, Dropdown, Menu } from 'antd';
import { 
  MenuUnfoldOutlined, 
  MenuFoldOutlined, 
  BellOutlined, 
  UserOutlined,
  UserSwitchOutlined, 
  LockOutlined,      
  LogoutOutlined,    
} from '@ant-design/icons';

const { Header } = Layout;

function HeaderBar({ collapsed, toggleCollapse }) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

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

  const userMenu = (
    <Menu>
      <Menu.Item 
        key="username" 
        disabled 
        style={{ 
          cursor: 'default',
          fontWeight: 'bold',
          padding: '8px 16px'
        }}
      >
        {username || 'Loading...'}
      </Menu.Item>
      
      <Menu.Divider />

      <Menu.Item key="1">
        <UserSwitchOutlined style={{ marginRight: '8px' }} />
        Profile
      </Menu.Item>
      
      <Menu.Item key="2">
        <LockOutlined style={{ marginRight: '8px' }} />
        Thay đổi mật khẩu
      </Menu.Item>
      
      <Menu.Item 
        key="3"
        style={{ 
          color: '#ff4d4f' 
        }}
      >
        <LogoutOutlined 
          style={{ 
            marginRight: '8px',
            color: '#ff4d4f' 
          }} 
        />
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Header
      style={{
        padding: '0 16px',
        background: colorBgContainer,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Button
        type="text"
        className="toggle"
        onClick={toggleCollapse}
        icon={collapsed ? <MenuUnfoldOutlined style={{ fontSize: '22px' }} /> : <MenuFoldOutlined style={{ fontSize: '22px' }} />}
      />

      <div style={{ display: 'flex', gap: '20px' }}>
        <Button
          type="text"
          icon={<BellOutlined style={{ fontSize: '22px' }} />}
        />

        <Dropdown overlay={userMenu} trigger={['click']}>
          <Button
            type="text"
            icon={<UserOutlined style={{ fontSize: '22px' }} />}
          />
        </Dropdown>
      </div>
    </Header>
  );
}

export default HeaderBar;