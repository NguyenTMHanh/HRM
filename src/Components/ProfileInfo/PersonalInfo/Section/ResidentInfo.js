import React from 'react';
import { Row, Col, Divider } from 'antd';
import './styles.css';

const ResidentInfo = ({
  provinceResident,
  districtResident,
  wardResident,
  houseNumberResident,
}) => {
  const infoItems = [
    { label: 'Tỉnh/Thành phố', value: provinceResident || 'N/A' },
    { label: 'Quận/Huyện', value: districtResident || 'N/A' },
    { label: 'Xã/Phường', value: wardResident || 'N/A' },
    { label: 'Số nhà', value: houseNumberResident || 'N/A' },
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

export default ResidentInfo;
