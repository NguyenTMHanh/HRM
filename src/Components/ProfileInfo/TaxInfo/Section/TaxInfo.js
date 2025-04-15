import React from 'react';
import { Row, Col, Divider } from 'antd';
import './styles.css';

const TaxInfo = ({ hasTax, taxCode }) => {
  const infoItems = [
    { label: 'Đã có mã số thuế', value: hasTax === true ? 'Có' : 'Không' },
    { label: 'Mã số thuế', value: taxCode || 'N/A' },
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

export default TaxInfo;
