import React, { useState } from 'react';
import { Layout } from 'antd';
import './styles.css';
import Logo from './Logo';
import MenuList from './MenuList';
import ToggleThemeButton from './ToggleThemeButton';

const { Sider } = Layout;

function Sidebar({ collapsed, toggleCollapse }) {
  const [darkTheme, setDarkTheme] = useState(true);

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  return (
    <Sider
      className="sidebar"
      theme={darkTheme ? 'dark' : 'light'}
      collapsed={collapsed}
      collapsible
      trigger={null}
      width={200} // Reduced from 250
      collapsedWidth={60} // Reduced from 80
    >
      <Logo />
      <div className="menu-container">
        <MenuList darkTheme={darkTheme} />
      </div>
      <ToggleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />
    </Sider>
  );
}

export default Sidebar;