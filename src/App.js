import React, { useState } from 'react';
import { Layout } from 'antd';
import Sidebar from './Components/SideBar/SideBar';
import HeaderBar from './Components/Header/Header';

function App() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout>
      <Sidebar collapsed={collapsed} />
      <Layout>
        <HeaderBar collapsed={collapsed} toggleCollapse={toggleCollapse} />
      </Layout>
    </Layout>
  );
}

export default App;
