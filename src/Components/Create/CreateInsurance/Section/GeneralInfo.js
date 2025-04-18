import React from "react";
import { Form, Select, Row, Col, DatePicker } from "antd";
import moment from "moment";

const GeneralInfo = ({ form }) => {
  const disabledEndDate = (current) => {
    return current && current < moment().startOf("day");
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12}>
        <Form.Item
          label="Tình trạng đóng bảo hiểm"
          name="bhStatus"
          rules={[{ required: true, message: "Vui lòng chọn tình trạng!" }]}
        >
          <Select placeholder="Chọn tình trạng đóng">
            <Select.Option value="Đang tham gia">Đang tham gia</Select.Option>
            <Select.Option value="Dừng đóng">Dừng đóng</Select.Option>
          </Select>
        </Form.Item>
      </Col>

      <Col xs={24} sm={12}>
        <Form.Item
          label="Ngày kết thúc đóng"
          name="bhEndDate"
          rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc!" }]}
        >
          <DatePicker
            format="DD/MM/YYYY"
            disabledDate={disabledEndDate}
            style={{ width: "100%" }}
            placeholder="Chọn ngày kết thúc"
          />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default GeneralInfo;