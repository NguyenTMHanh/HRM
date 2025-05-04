import React, { useState, useEffect } from "react";
import { Input, Button, Row, Col, Form, Select } from "antd";
import styled from "styled-components";

const DeleteButton = styled(Button)`
  background-color: #f5222d;
  border-color: #f5222d;
  color: white;
  border-radius: 4px;
  padding: 8px 16px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #fff !important;
    border-color: #d42a2a !important;
    color: #d42a2a !important;
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }
`;

const AddButton = styled(Button)`
  background-color: #001b45;
  border-color: #001b45;
  color: #fff;
  border-radius: 4px;
  padding: 8px 16px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #002d72 !important;
    border-color: #002d72;
    color: #fff !important;
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }
`;

const Position = ({ form, isViewMode }) => {
  const [positions, setPositions] = useState([]);

  const handleAddPosition = () => {
    const newId = positions.length + 1;
    const updated = [
      ...positions,
      { positionCode: `POS${newId.toString().padStart(3, "0")}`, name: "", departmentId: null, description: "" }
    ];
    setPositions(updated);
    form.setFieldsValue({ positions: updated });
  };

  const handleDeletePosition = (index) => {
    const updated = positions
      .filter((_, i) => i !== index)
      .map((position, i) => ({
        ...position,
        id: i + 1,
      }));
    setPositions(updated);
    form.setFieldsValue({ positions: updated });
  };

  useEffect(() => {
    const initial = form.getFieldValue("positions") || [];
    setPositions(initial);
  }, [form]);

  // Danh sách bộ phận mẫu (có thể thay bằng dữ liệu từ API)
  const departments = [
    { id: 1, name: "Bộ phận Kế toán" },
    { id: 2, name: "Bộ phận Nhân sự" },
    { id: 3, name: "Bộ phận Marketing" },
    { id: 4, name: "Bộ phận Công nghệ" },
  ];

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
      {positions.map((position, index) => (
        <Row gutter={[16, 16]} key={index}>
          <Col xs={24} sm={6}>
            <Form.Item
              label="Mã vị trí"
              name={["positions", index, "positionCode"]}
              rules={[{ required: true, message: "Vui lòng nhập mã vị trí" }]}
            >
              <Input
                placeholder="Mã vị trí"
                disabled
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={6}>
            <Form.Item
              label="Tên vị trí"
              name={["positions", index, "name"]}
              rules={[{ required: true, message: "Vui lòng nhập tên vị trí" }]}
            >
              <Input
                placeholder="Tên vị trí"
                disabled={isViewMode}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={6}>
            <Form.Item
              label="Bộ phận"
              name={["positions", index, "departmentId"]}
              rules={[{ required: true, message: "Vui lòng chọn bộ phận" }]}
            >
              <Select
                placeholder="Chọn bộ phận"
                disabled={isViewMode}
              >
                {departments.map((dept) => (
                  <Select.Option key={dept.id} value={dept.id}>
                    {dept.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={4}>
            <Form.Item
              label="Mô tả"
              name={["positions", index, "description"]}
            >
              <Input
                placeholder="Mô tả"
                disabled={isViewMode}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={2} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {!isViewMode && (
              <DeleteButton onClick={() => handleDeletePosition(index)}>
                Xóa
              </DeleteButton>
            )}
          </Col>
        </Row>
      ))}

      {!isViewMode && (
        <Form.Item>
          <AddButton onClick={handleAddPosition} block>
            Thêm mới vị trí
          </AddButton>
        </Form.Item>
      )}
    </div>
  );
};

export default Position;