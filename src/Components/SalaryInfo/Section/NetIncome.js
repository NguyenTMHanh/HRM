import React from 'react';
import { Row, Col, Divider } from 'antd';


const NetIncome = ({
  totalIncome,
  taxAmount,
  insuranceAmountDeducted,
  advances = [],
  netIncome,
}) => {
  const formatNumber = (number) => {
    if (!number && number !== 0) return 'N/A';
    return typeof number === 'number' ? number.toLocaleString('fr-FR') : number;
  };

  const totalAdvance = Array.isArray(advances)
    ? advances.reduce((sum, adv) => sum + (adv.amount || 0), 0)
    : 0;



  const items = [
    { label: 'Tổng thu nhập', value: formatNumber(totalIncome) },
    { label: 'Thuế TNCN', value: formatNumber(taxAmount) },
    { label: 'Tiền bảo hiểm trừ vào lương', value: formatNumber(insuranceAmountDeducted) },
    { label: 'Tạm ứng', value: formatNumber(totalAdvance) },
    { label: 'Thu lĩnh', value: formatNumber(netIncome) },
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

export default NetIncome;
