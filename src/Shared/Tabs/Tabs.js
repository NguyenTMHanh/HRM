import React, { useState } from 'react';
import { Tabs } from 'antd';
import './styles.css';

const CustomTabs = ({ items, activeKey, onChange, tabStyle, activeTabStyle, labelStyle, ...props }) => {
  // Chuyển đổi items để đảm bảo tương thích với API mới của Tabs
  const tabItems = items.map(item => ({
    key: item.key,
    label: item.label, // Tên tab
    children: item.children, // Nội dung của tab
  }));

  return (
    <Tabs
      style={tabStyle || {}}
      tabBarStyle={activeTabStyle || { borderBottom: '0px solid #fff' }}
      activeKey={activeKey}
      onChange={onChange}
      items={tabItems} // Sử dụng items thay vì Tabs.TabPane
      {...props}
    />
  );
};

export default CustomTabs;