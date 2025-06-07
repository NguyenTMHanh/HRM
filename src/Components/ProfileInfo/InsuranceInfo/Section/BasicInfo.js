import React from 'react';
import { Row, Col, Divider } from 'antd';
import './styles.css'; 

const BasicInfo = ({
  employeeCode,
  fullName,
  gender,
  dateOfBirth,
}) => {
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return typeof date === 'string' ? date : date.format('DD/MM/YYYY');
  };

  const infoItems = [
    { label: 'Mã số nhân viên', value: employeeCode },
    { label: 'Họ và tên', value: fullName },
    { label: 'Giới tính', value: gender },
    { label: 'Ngày sinh', value: formatDate(dateOfBirth) },   
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

export default BasicInfo;
