import React from 'react';
import { Row, Col, Divider } from 'antd';


const InsuranceSubSalary = ({
  basicHourlySalary,
  allowanceForInsurance,
  insuranceRateTotal,
}) => {
  const formatNumber = (number) => {
    if (!number && number !== 0) return 'N/A';
    return typeof number === 'number' ? number.toLocaleString('fr-FR') : number;
  };
  const insuranceBaseSalary = 
    typeof basicHourlySalary === 'number' && typeof allowanceForInsurance === 'number'
      ? basicHourlySalary + allowanceForInsurance
      : null;

  const insuranceAmountDeducted = 
    typeof insuranceRateTotal === 'number' && typeof insuranceBaseSalary === 'number'
      ? (insuranceBaseSalary * insuranceRateTotal) / 100
      : null;

  const items = [
    { label: 'Lương cơ bản theo giờ', value: formatNumber(basicHourlySalary) },
    { label: 'Tổng phụ cấp đóng bảo hiểm', value: formatNumber(allowanceForInsurance) },
    { label: 'Lương đóng bảo hiểm', value: formatNumber(insuranceBaseSalary) },
    { label: 'Tiền bảo hiểm trừ vào lương', value: formatNumber(insuranceAmountDeducted) },
  ];

  return (
    <div className="info-display">
      {items.map((item, index) => (
        <div key={index}>
          <Row gutter={[16, 16]} className="info-row">
            <Col xs={12} sm={6} className="info-label">
              {item.label}
            </Col>
            <Col xs={12} sm={6} className="info-value">
              {item.value}
            </Col>
          </Row>
          {index < items.length - 1 && <Divider className="info-divider" />}
        </div>
      ))}
    </div>
  );
};

export default InsuranceSubSalary;
