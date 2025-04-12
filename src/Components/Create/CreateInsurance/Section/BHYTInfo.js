import React from 'react';
import { Form, Input, Row, Col, DatePicker } from 'antd';
import moment from 'moment';

const BHYTInfo = () => {
  const disabledStartDate = (current) => {
    return current && current < moment().startOf('day');
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={6}>
        <Form.Item
          label="Mã số BHYT"
          name="bhytCode"
          rules={[{ required: true, message: 'Vui lòng nhập mã số BHYT!' }]}
        >
          <Input disabled placeholder="Mã số bảo hiểm y tế" />
        </Form.Item>
      </Col>

      <Col xs={24} sm={6}>
        <Form.Item
          label="Tỷ lệ đóng BHYT"
          name="bhytRate"
          rules={[{ required: true, message: 'Vui lòng nhập tỷ lệ đóng BHYT!' }]}
        >
          <Input disabled placeholder="Tỷ lệ ví dụ: 1% NLĐ / 3% DN" />
        </Form.Item>
      </Col>

      <Col xs={24} sm={6}>
        <Form.Item
          label="Nơi khám chữa bệnh đăng ký"
          name="registeredHospital"
          rules={[{ required: true, message: 'Vui lòng nhập nơi khám chữa bệnh!' }]}
        >
          <Input placeholder="VD: Bệnh viện Quận 1" />
        </Form.Item>
      </Col>

      <Col xs={24} sm={6}>
        <Form.Item
          label="Ngày bắt đầu tham gia BHYT"
          name="bhytStartDate"
          rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu BHYT!' }]}
        >
          <DatePicker
            format="DD/MM/YYYY"
            disabledDate={disabledStartDate}
            style={{ width: '100%' }}
            placeholder="Chọn ngày bắt đầu"
          />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default BHYTInfo;
