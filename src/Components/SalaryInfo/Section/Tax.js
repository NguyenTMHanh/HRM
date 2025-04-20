import React from 'react';
import { Row, Col, Divider } from 'antd';


const Tax = ({
  personalDeduction,
  dependentDeduction,
  insuranceAmountDeducted,
  taxExemptAllowance,
  totalIncome,
  taxRate, // đơn vị %
}) => {
  const formatNumber = (number) => {
    if (!number && number !== 0) return 'N/A';
    return typeof number === 'number' ? number.toLocaleString('fr-FR') : number;
  };

  const totalDeduction =
    [personalDeduction, dependentDeduction, insuranceAmountDeducted, taxExemptAllowance].every(
      (n) => typeof n === 'number'
    )
      ? personalDeduction + dependentDeduction + insuranceAmountDeducted + taxExemptAllowance
      : null;

  const taxableIncome =
    typeof totalIncome === 'number' && typeof totalDeduction === 'number'
      ? Math.max(totalIncome - totalDeduction, 0)
      : null;

  const taxAmount =
    typeof taxableIncome === 'number' && typeof taxRate === 'number'
      ? (taxableIncome * taxRate) / 100
      : null;

  const items = [
    { label: 'Tổng thu nhập', value: formatNumber(totalIncome) },
    { label: 'Giảm trừ bản thân', value: formatNumber(personalDeduction) },
    { label: 'Giảm trừ người phụ thuộc', value: formatNumber(dependentDeduction) },
    { label: 'Tiền bảo hiểm trừ vào lương', value: formatNumber(insuranceAmountDeducted) },
    { label: 'Tổng phụ cấp miễn thuế', value: formatNumber(taxExemptAllowance) },
    { label: 'Tổng các khoản giảm trừ', value: formatNumber(totalDeduction) },
    { label: 'Thuế suất (%)', value: taxRate != null ? `${taxRate}%` : 'N/A' },
    { label: 'Thuế TNCN', value: formatNumber(taxAmount) },
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

export default Tax;
