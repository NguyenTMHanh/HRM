import React from 'react';
import { Row, Col, Divider } from 'antd';
import './styles.css';

const GeneralInfo = ({
  bhStatus,
  bhEndDate,
}) => {
    const formatDate = (date) => {
        if (!date) return 'N/A';
        return typeof date === 'string' ? date : date.format('DD/MM/YYYY');
    };
  const infoItems = [
    { label: 'Tình trạng đóng bảo hiểm', value: bhStatus || 'N/A' },
    {
      label: 'Ngày kết thúc đóng', value: formatDate(bhEndDate),
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

export default GeneralInfo;
