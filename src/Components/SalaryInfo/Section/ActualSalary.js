import React from 'react';
import { Row, Col, Divider } from 'antd';


const ActualSalary = ({
  totalActualHours,
  totalActualWorkDays, 
  hourlyWage,
  salaryCoefficient,
  actualHourlySalary,
}) => {
  const formatNumber = (number) => {
    if (!number && number !== 0) return 'N/A';
    return typeof number === 'number' ? number.toLocaleString('fr-FR') : number;
  };

  const infoItems = [
    { label: 'Tổng giờ làm việc thực tế', value: formatNumber(totalActualHours) },
    { label: 'Tổng ngày công thực tế', value: formatNumber(totalActualWorkDays) },
    { label: 'Mức lương/1h', value: formatNumber(hourlyWage) },
    { label: 'Hệ số lương', value: formatNumber(salaryCoefficient) },
    { label: 'Lương thực tế theo giờ', value: formatNumber(actualHourlySalary) },
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

export default ActualSalary;
