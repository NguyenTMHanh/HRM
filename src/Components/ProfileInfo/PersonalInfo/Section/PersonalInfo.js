import React from 'react';
import { Row, Col, Divider } from 'antd';
import './styles.css';

const PersonalInfo = ({
  fullName,
  gender,
  dateOfBirth,
  nationality,
  ethnicity,
  identityNumber,
  issuedDate,
  issuedPlace,
}) => {
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return typeof date === 'string' ? date : date.format('DD/MM/YYYY');
  };

  const infoItems = [
    { label: 'Họ và tên', value: fullName || 'N/A' },
    { label: 'Giới tính', value: gender || 'N/A' },
    { label: 'Ngày sinh', value: formatDate(dateOfBirth) },
    { label: 'Quốc tịch', value: nationality || 'N/A' },
    { label: 'Dân tộc', value: ethnicity || 'N/A' },
    { label: 'CMND/CCCD/Hộ chiếu', value: identityNumber || 'N/A' },
    { label: 'Ngày cấp', value: formatDate(issuedDate) },
    { label: 'Nơi cấp', value: issuedPlace || 'N/A' },
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

export default PersonalInfo;
