import React from 'react';
import { Row, Col, Divider } from 'antd';
import './styles.css'; 

const ContractInfo = ({
  contractId,
  contractType,
  startDate,
  endDate,
  status,
  hourlyWage,
  workHoursPerDay,
  position,
  salaryCoefficient,
  standardWorkingDays,
  basicSalary,
}) => {
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return typeof date === 'string' ? date : date.format('DD/MM/YYYY');
  };

  const infoItems = [
    { label: 'Mã số HĐLĐ', value: contractId || "" },
    { label: 'Loại hợp đồng', value: contractType || "" },
    { label: 'Ngày bắt đầu HĐ', value: formatDate(startDate)},
    { label: 'Ngày kết thúc HĐ', value: formatDate(endDate)},
    { label: 'Tình trạng', value: status || "" },
    { label: 'Mức lương/1h', value: hourlyWage || "" },
    { label: 'Số giờ làm việc chuẩn/1 ngày', value: workHoursPerDay || "" },
    { label: 'Vị trí', value: position || "" },
    { label: 'Hệ số lương', value: salaryCoefficient || "" },
    { label: 'Ngày công chuẩn', value: standardWorkingDays || "" },
    { label: 'Tiền lương cơ bản', value: basicSalary || "" },
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

export default ContractInfo;
