import React from 'react';
import { Collapse } from 'antd';
import './styles.css';

const CollapseComponent = ({ item, headerStyle, panelStyle, headerTitleStyle }) => {
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
      className: 'panel-collapse',
      style: panelStyle,
    },
  ];

  return (
    <Collapse
      defaultActiveKey={Array.from({ length: 15 }, (_, i) => String(i + 1))}
      expandIconPosition="end"
      items={collapseItems}
    />
  );
};

export default CollapseComponent;