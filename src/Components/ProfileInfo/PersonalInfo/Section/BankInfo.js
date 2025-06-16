import React from 'react';
import { Row, Col, Divider } from 'antd';
import './styles.css'; 

const BankInfo = ({ accountNumber, bank, bankBranch }) => {
  const infoItems = [
    { label: 'Số tài khoản', value: accountNumber || 'N/A' },
    { label: 'Ngân hàng', value: bank || 'N/A' },
    { label: 'Chi nhánh', value: bankBranch || 'N/A' },
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

export default BankInfo;
