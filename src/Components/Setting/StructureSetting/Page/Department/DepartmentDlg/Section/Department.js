import React from "react";
import { Input, Row, Col, Form } from "antd";

const Department = ({ form, isViewMode }) => {
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
      <Form.List name="departments">
        {(fields) => (
          <>
            {fields.slice(0, 1).map(({ key, name, ...restField }) => (
              <Row gutter={[16, 16]} key={key}>
                <Col xs={24} sm={8}>
                  <Form.Item
                    {...restField}
                    label="Mã bộ phận"
                    name={[name, "departmentCode"]}
                    rules={[{ required: true, message: "Vui lòng nhập mã bộ phận" }]}
                  >
                    <Input placeholder="Mã bộ phận" disabled />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={8}>
                  <Form.Item
                    {...restField}
                    label="Tên bộ phận"
                    name={[name, "name"]}
                    rules={[{ required: true, message: "Vui lòng nhập tên bộ phận" }]}
                  >
                    <Input placeholder="Tên bộ phận" disabled={isViewMode} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={8}>
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

export default Department;