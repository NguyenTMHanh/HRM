import React from "react";
import { Input, Row, Col, Form, Select } from "antd";

const { Option } = Select;

const Position = ({ form, isViewMode, departments }) => {
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

          /* Style for disabled Select */
          .view-mode .ant-select-disabled .ant-select-selector {
            background-color: white !important;
            color: rgba(0, 0, 0, 0.85) !important; /* Normal text color */
            cursor: not-allowed;
            border-color: #d9d9d9 !important; /* Match default Ant Design border */
          }

          .edit-mode .ant-select-disabled .ant-select-selector {
            background-color: #f5f5f5 !important; /* Grey background */
            color: #C4C4C4 !important; /* Light grey text color */
            cursor: not-allowed;
            border-color: #d9d9d9 !important; /* Match default Ant Design border */
          }

          /* Ensure the Select arrow is visible */
          .ant-select-disabled .ant-select-arrow {
            color: rgba(0, 0, 0, 0.85) !important; /* Match text color */
          }
        `}
      </style>
      <Form.List name="positions">
        {(fields) => (
          <>
            {fields.slice(0, 1).map(({ key, name, ...restField }) => (
              <Row gutter={[16, 16]} key={key}>
                <Col xs={24} sm={6}>
                  <Form.Item
                    {...restField}
                    label="Mã vị trí"
                    name={[name, "positionCode"]}
                    rules={[{ required: true, message: "Vui lòng nhập mã vị trí" }]}
                  >
                    <Input placeholder="Mã vị trí" disabled />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={6}>
                  <Form.Item
                    {...restField}
                    label="Tên vị trí"
                    name={[name, "name"]}
                    rules={[{ required: true, message: "Vui lòng nhập tên vị trí" }]}
                  >
                    <Input placeholder="Tên vị trí" disabled={isViewMode} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={6}>
                  <Form.Item
                    {...restField}
                    label="Bộ phận"
                    name={[name, "departmentId"]}
                    rules={[{ required: true, message: "Vui lòng chọn bộ phận" }]}
                  >
                    <Select placeholder="Chọn bộ phận" disabled={isViewMode}>
                      {departments.map((dept) => (
                        <Option key={dept.id} value={dept.departmentName}>
                          {dept.departmentName}
                        </Option>
                      ))}
                    </Select>
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

export default Position;