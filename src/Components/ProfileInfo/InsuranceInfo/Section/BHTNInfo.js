import React from 'react';
import { Row, Col, Divider } from 'antd';
import './styles.css';

const BHTNInfo = ({
  bhtnRate,
  bhtnStartDate,
}) => {
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return typeof date === 'string' ? date : date.format('DD/MM/YYYY');
};
  const infoItems = [
    { label: 'Tỷ lệ đóng BHTN', value: bhtnRate || 'N/A' },
    {
      label: 'Ngày bắt đầu tham gia BHTN',
      value: formatDate(bhtnStartDate),
    },
  ];

  return (
    <div className="info-display">
      {infoItems.map((item, index) => (
        <div key={index}>
          <Row gutter={[16, 16]} className="info-row">
            <Col xs={12} sm={6} className="info-label">
              {item.label}
            </Col>
            <Col xs={12} sm={18} className="info-value" style={{ flex: 1 }}>
              {item.value}
            </Col>
          </Row>
          {index < infoItems.length - 1 && <Divider className="info-divider" />}
        </div>
      ))}
    </div>
  );
};

export default BHTNInfo;
