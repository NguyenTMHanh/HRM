import React from "react";
import { Input, Row, Col, Form } from "antd";

const Rank = ({ form, isViewMode }) => {
  return (
    <div className={isViewMode ? "view-mode" : "edit-mode"}>
      <style>
        {`
          /* Style for disabled Input */
          .view-mode .ant-input-disabled {
            background-color: white !important;
            color: rgba(0, 0, 0, 0.85) !important; /* Normal text color */
            cursor: not-allowed;
          }

          .edit-mode .ant-input-disabled {
            background-color: #f5f5f5 !important; /* Grey background */
            color: #C4C4C4 !important; /* Light grey text color */
            cursor: not-allowed;
          }
        `}
      </style>
      <Form.List name="ranks">
        {(fields) => (
          <>
            {fields.slice(0, 1).map(({ key, name, ...restField }, index) => (
              <Row gutter={[16, 16]} key={key}>
                <Col xs={24} sm={6}>
                  <Form.Item
                    {...restField}
                    label="Mã cấp bậc"
                    name={[name, "rankCode"]}
                    rules={[{ required: true, message: "Vui lòng nhập mã cấp bậc" }]}
                  >
                    <Input placeholder="Mã cấp bậc" disabled />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={6}>
                  <Form.Item
                    {...restField}
                    label="Mức độ ưu tiên"
                    name={[name, "priority"]}
                    rules={[{ required: true, message: "Vui lòng nhập mức độ ưu tiên" }]}
                  >
                    <Input type="number" placeholder="Mức độ ưu tiên" min={1} disabled={isViewMode} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={6}>
                  <Form.Item
                    {...restField}
                    label="Tên cấp bậc"
                    name={[name, "name"]}
                    rules={[{ required: true, message: "Vui lòng nhập tên cấp bậc" }]}
                  >
                    <Input placeholder="Tên cấp bậc" disabled={isViewMode} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={6}>
                  <Form.Item
                    {...restField}
                    label="Mô tả"
                    name={[name, "description"]}
                  >
                    <Input placeholder="Mô tả" disabled={isViewMode} />
                  </Form.Item>
                </Col>
              </Row>
            ))}
          </>
        )}
      </Form.List>
    </div>
  );
};

export default Rank;