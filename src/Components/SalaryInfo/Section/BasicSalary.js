import React from 'react';
import { Row, Col, Divider } from 'antd';

const BasicSalary = ({
  hourlyWage,
  salaryCoefficient,
  standardWorkingDays,
  basicHourlySalary,
}) => {
  const formatNumber = (number) => {
    if (!number && number !== 0) return 'N/A';
    return typeof number === 'number' ? number.toLocaleString('fr-FR') : number;
  };
  const infoItems = [
    { label: 'Mức lương/1h', value: formatNumber(hourlyWage) },
    { label: 'Hệ số lương', value: formatNumber(salaryCoefficient) },
    { label: 'Số ngày công chuẩn', value: formatNumber(standardWorkingDays) },
    { label: 'Lương cơ bản tính theo giờ', value: formatNumber(basicHourlySalary) },
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

export default BasicSalary;