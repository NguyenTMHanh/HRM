import React, { useState, useEffect } from "react";
import { Input, Button, Row, Col, Form } from "antd";
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

const Department = ({ form }) => {
  const [departments, setDepartments] = useState([]);

  const handleAddDepartment = () => {
    const newId = departments.length + 1;
    const updated = [
      ...departments,
      { id: newId, departmentCode: "", name: "", description: "" }
    ];
    setDepartments(updated);
    form.setFieldsValue({ departments: updated });
  };

  const handleDepartmentChange = (index, field, value) => {
    const updated = [...departments];
    updated[index][field] = value;
    setDepartments(updated);
    form.setFieldsValue({ departments: updated });
  };

  const handleDeleteDepartment = (index) => {
    const updated = departments
      .filter((_, i) => i !== index)
      .map((dept, i) => ({
        ...dept,
        id: i + 1,
      }));
    setDepartments(updated);
    form.setFieldsValue({ departments: updated });
  };

  useEffect(() => {
    const initial = form.getFieldValue("departments") || [];
    setDepartments(initial);
  }, [form]);

  return (
    <>
      {departments.map((dept, index) => (
        <Row gutter={[16, 16]} key={index}>
          <Col xs={24} sm={6}>
            <Form.Item
              label="Mã bộ phận"
              name={["departments", index, "departmentCode"]}
              rules={[{ required: true, message: "Vui lòng nhập mã bộ phận" }]}
            >
              <Input
                value={dept.departmentCode}
                placeholder="Mã bộ phận"
                disabled
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item
              label="Tên bộ phận"
              name={["departments", index, "name"]}
              rules={[{ required: true, message: "Vui lòng nhập tên bộ phận" }]}
            >
              <Input
                value={dept.name}
                onChange={(e) => handleDepartmentChange(index, "name", e.target.value)}
                placeholder="Tên bộ phận"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item
              label="Mô tả"
              name={["departments", index, "description"]}
            >
              <Input
                value={dept.description}
                onChange={(e) => handleDepartmentChange(index, "description", e.target.value)}
                placeholder="Mô tả"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={2} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <DeleteButton onClick={() => handleDeleteDepartment(index)}>
              Xóa
            </DeleteButton>
          </Col>
        </Row>
      ))}

      <Form.Item>
        <AddButton onClick={handleAddDepartment} block>
          Thêm mới bộ phận
        </AddButton>
      </Form.Item>
    </>
  );
};

export default Department;