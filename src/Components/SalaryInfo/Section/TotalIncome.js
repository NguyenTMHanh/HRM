import React from 'react';
import { Row, Col, Divider } from 'antd';
import './styles.css';

const TotalIncome = ({
  actualHourlySalary,
  totalAllowance,
  totalActualWorkDays,
  totalAllowanceReceived,
  totalBonus,
  totalPenalty,
}) => {
  const formatNumber = (number) => {
    if (!number && number !== 0) return 'N/A';
    return typeof number === 'number' ? number.toLocaleString() : number;
  };

  const incomeItems = [
    { label: 'Lương thực tế theo giờ', value: formatNumber(actualHourlySalary) },
    { label: 'Tổng phụ cấp', value: formatNumber(totalAllowance) },
    { label: 'Tổng ngày công thực tế', value: formatNumber(totalActualWorkDays) },
    { label: 'Tổng phụ cấp thực nhận', value: formatNumber(totalAllowanceReceived) },
    { label: 'Tổng thưởng', value: formatNumber(totalBonus) },
    { label: 'Tổng phạt', value: formatNumber(totalPenalty) },
  ];

  return (
    <div className="info-display">
      {incomeItems.map((item, index) => (
        <div key={index}>
          <Row gutter={[16, 16]} className="info-row">
            <Col xs={12} sm={6} className="info-label">
              {item.label}
            </Col>
            <Col xs={12} sm={6} className="info-value">
              {item.value}
            </Col>
          </Row>
          {index < incomeItems.length - 1 && <Divider className="info-divider" />}
        </div>
      ))}
    </div>
  );
};

export default TotalIncome;
