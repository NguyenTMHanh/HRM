import React from 'react';
import { Collapse } from 'antd';
import './styles.css'; // Import file CSS thông thường

const CollapseComponent = ({ item, headerStyle, panelStyle, headerTitleStyle }) => {
  // Chuyển đổi item thành mảng items phù hợp với API mới của Collapse
  const collapseItems = [
    {
      key: item.key,
      label: (
        <div style={headerStyle} className="header-collapse">
          <span style={headerTitleStyle} className="header-title">
            {item.header}
          </span>
        </div>
      ),
      children: item.children,
      className: 'panel-collapse', // Áp dụng className cho panel
      style: panelStyle, 
    },
  ];

  return (
    <Collapse
      defaultActiveKey={['1', '2', '3', '4', '5']}
      expandIconPosition="end"
      items={collapseItems} 
    />
  );
};

export default CollapseComponent;