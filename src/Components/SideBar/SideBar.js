import React, { useState } from 'react';
import { Button, Layout, theme } from 'antd';
import './styles.css';
import Logo from './Logo';
import MenuList from './MenuList';
import ToggleThemeButton from './ToggleThemeButton';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
const { Header, Sider } = Layout;

function SideBar() {
  const [darkTheme, setDarkTheme] = useState(true);
  const [collaped, setCollaped] = useState(false);
  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  }
  const {
    token: { colorBgContainer },

  } = theme.useToken();
  return (
    <Layout>
      <Sider
        className="sidebar"
        theme={darkTheme ? 'dark' : 'light'}
        collapsed={collaped}
        collapsible
        trigger={null}
        width={250}
        collapsedWidth={80}
      >
        <Logo />
        <div className="menu-container">
          <MenuList darkTheme={darkTheme} />
        </div>
        <ToggleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />
      </Sider>

      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type='text'
            className='toggle'
            onClick={() => setCollaped(!collaped)}
            icon={collaped ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}>

          </Button>
        </Header>
      </Layout>
    </Layout>
  );
}

export default SideBar;
