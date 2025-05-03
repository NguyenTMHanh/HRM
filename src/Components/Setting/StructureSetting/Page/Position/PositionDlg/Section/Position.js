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

const Position = ({ form }) => {
  const [positions, setPositions] = useState([]);

  const handleAddPosition = () => {
    const newId = positions.length + 1;
    const updated = [
      ...positions,
      { positionCode: "", name: "", departmentId: null, description: "" }
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
    <>
      {positions.map((position, index) => (
        <Row gutter={[16, 16]} key={index}>
          <Col xs={24} sm={6}>
            <Form.Item
              label="Mã vị trí"
              name={["positions", index, "positionCode"]}
              rules={[{ required: true, message: "Vui lòng nhập mã vị trí" }]}
            >
              <Input
                value={position.positionCode}
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
                value={position.name}
                placeholder="Tên vị trí"
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
                value={position.departmentId}
                placeholder="Chọn bộ phận"
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
                value={position.description}
                placeholder="Mô tả"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={2} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <DeleteButton onClick={() => handleDeletePosition(index)}>
              Xóa
            </DeleteButton>
          </Col>
        </Row>
      ))}

      <Form.Item>
        <AddButton onClick={handleAddPosition} block>
          Thêm mới vị trí
        </AddButton>
      </Form.Item>
    </>
  );
};

export default Position;