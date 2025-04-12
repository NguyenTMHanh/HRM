import React from "react";
import { Form, Input, Row, Col, DatePicker } from "antd";
import moment from "moment";

const BHTNInfo = ({ form }) => {
  const disabledStartDate = (current) => {
    return current && current < moment().startOf("day");
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12}>
        <Form.Item
          label="Tỷ lệ đóng BHTN"
          name="bhtnRate"
          rules={[{ required: true, message: "Vui lòng nhập tỷ lệ đóng BHTN!" }]}
        >
          <Input disabled placeholder="Tỷ lệ ví dụ: 1% NLĐ / 1% DN" />
        </Form.Item>
      </Col>

      <Col xs={24} sm={12}>
        <Form.Item
          label="Ngày bắt đầu tham gia BHTN"
          name="bhtnStartDate"
          rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu BHTN!" }]}
        >
          <DatePicker
            format="DD/MM/YYYY"
            disabledDate={disabledStartDate}
            style={{ width: "100%" }}
            placeholder="Chọn ngày bắt đầu"
          />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default BHTNInfo;