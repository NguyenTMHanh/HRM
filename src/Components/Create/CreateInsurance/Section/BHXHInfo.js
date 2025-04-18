import React from 'react';
import { Form, Input, Row, Col, Checkbox, DatePicker } from 'antd';
import moment from 'moment';

const BHXHInfo = ({ form, bhxhCode }) => {
  const disabledStartDate = (current) => {
    return current && current < moment().startOf('day');
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24}>
        <Form.Item name="hasJoined" valuePropName="checked" noStyle>
          <Checkbox>Đã từng tham gia BHXH</Checkbox>
        </Form.Item>
      </Col>

      <Col xs={24} sm={8}>
        <Form.Item
          label="Mã số BHXH"
          name="bhxhCode"
          rules={[{ required: true, message: 'Vui lòng nhập mã số BHXH!' }]}
        >
          <Input
            value={bhxhCode}
            disabled
            placeholder="Tự động lấy từ mã BHYT"
          />
        </Form.Item>
      </Col>

      <Col xs={24} sm={8}>
        <Form.Item
          label="Tỷ lệ đóng BHXH"
          name="bhxhRate"
          rules={[{ required: true, message: 'Vui lòng nhập tỷ lệ đóng BHXH!' }]}
        >
          <Input disabled placeholder="Ví dụ: 8% NLĐ / 17.5% DN" />
        </Form.Item>
      </Col>

      <Col xs={24} sm={8}>
        <Form.Item
          label="Ngày bắt đầu tham gia BHXH"
          name="bhxhStartDate"
          rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu BHXH!' }]}
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

export default BHXHInfo;