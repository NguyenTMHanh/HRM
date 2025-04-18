import React from 'react';
import { Row, Col, Divider } from 'antd';
import './styles.css'; 

const ContactInfo = ({
  provinceContact,
  districtContact,
  wardContact,
  houseNumberContact,
  phoneNumber,
  email,
}) => {
  const infoItems = [
    { label: 'Tỉnh/Thành phố', value: provinceContact || 'N/A' },
    { label: 'Quận/Huyện', value: districtContact || 'N/A' },
    { label: 'Xã/Phường', value: wardContact || 'N/A' },
    { label: 'Số nhà', value: houseNumberContact || 'N/A' },
    { label: 'Số điện thoại', value: phoneNumber || 'N/A' },
    { label: 'Email', value: email || 'N/A' },
  ];

  return (
    <div className="info-display">
      {infoItems.map((item, index) => (
        <div key={index}>
          <Row gutter={[16, 16]} className="info-row">
            <Col xs={12} sm={6} className="info-label">
              {item.label}
            </Col>
            <Col xs={12} sm={6} className="info-value">
              {item.value}
            </Col>
          </Row>
          {index < infoItems.length - 1 && <Divider className="info-divider" />}
        </div>
      ))}
    </div>
  );
};

export default ContactInfo;
