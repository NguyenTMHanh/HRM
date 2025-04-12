import React from 'react';
import { Row, Col, Form, Checkbox, Input } from 'antd';

const TaxInfo = () => {
  return (
    <Row gutter={16} align="middle">
      <Col xs={24} sm={12}>
        <Form.Item name="hasTax" valuePropName="checked" noStyle>
          <Checkbox
          >
            Đã có mã số thuế
          </Checkbox>
        </Form.Item>
      </Col>


      <Col xs={24} sm={12}>
        <Form.Item
          label="Mã số thuế"
          name="taxCode"
          style={{ marginBottom: 0 }}
          rules={[
            { required: true, message: 'Vui lòng nhập mã số thuế!' },
            { pattern: /^[0-9]+$/, message: 'Mã số thuế chỉ gồm chữ số 0–9.' }
          ]}
        >
          <Input
            placeholder="Nhập mã số thuế"
          />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default TaxInfo;
