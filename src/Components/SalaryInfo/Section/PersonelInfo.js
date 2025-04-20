import React from 'react';
import { Row, Col, Divider } from 'antd';


const PersonelInfo = ({
  employeeId,
  fullName,
  branch,
  department,
  position,
  workType,
  email,
  phoneNumber,
}) => {
  const formatString = (value) => {
    if (!value) return 'N/A';
    return typeof value === 'string' ? value : String(value);
  };

  const infoItems = [
    { label: 'Mã số nhân sự', value: formatString(employeeId) },
    { label: 'Họ và tên NLĐ', value: formatString(fullName) },
    { label: 'Chi nhánh', value: formatString(branch) },
    { label: 'Bộ phận', value: formatString(department) },
    { label: 'Vị trí', value: formatString(position) },
    { label: 'Hình thức làm việc', value: formatString(workType) },
    { label: 'Email', value: formatString(email) },
    { label: 'Số điện thoại', value: formatString(phoneNumber) },
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

export default PersonelInfo;