import React from 'react';
import { Row, Col, Divider } from 'antd';
import './styles.css';

const BHXHInfo = ({
  hasJoined,
  bhxhCode,
  bhxhRate,
  bhxhStartDate,
}) => {
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return typeof date === 'string' ? date : date.format('DD/MM/YYYY');
};
  const infoItems = [
    { label: 'Đã từng tham gia BHXH', value: hasJoined === true ? 'Có tham gia' : 'Không tham gia' },
    { label: 'Mã số BHXH', value: bhxhCode || 'N/A' },
    { label: 'Tỷ lệ đóng BHXH', value: bhxhRate || 'N/A' },
    { label: 'Ngày bắt đầu tham gia BHXH', value: formatDate(bhxhStartDate)},
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

export default BHXHInfo;
