import React from "react";
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
  const handleAddDepartment = () => {
    const currentDepartments = form.getFieldValue("departments") || [];
    const newId = currentDepartments.length + 1;
    const updated = [
      ...currentDepartments,
      { id: newId, departmentCode: `D${newId.toString().padStart(3, "0")}`, name: "", description: "" },
    ];
    form.setFieldsValue({ departments: updated });
  };

  const handleDeleteDepartment = (index) => {
    const currentDepartments = form.getFieldValue("departments") || [];
    const updated = currentDepartments
      .filter((_, i) => i !== index)
      .map((dept, i) => ({
        ...dept,
        id: i + 1,
        departmentCode: `D${(i + 1).toString().padStart(3, "0")}`,
      }));
    form.setFieldsValue({ departments: updated });
  };

  return (
    <Form.List name="departments">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }, index) => (
            <Row gutter={[16, 16]} key={key}>
              <Col xs={24} sm={6}>
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
                  <Input placeholder="Tên bộ phận" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={8}>
                <Form.Item
                  {...restField}
                  label="Mô tả"
                  name={[name, "description"]}
                >
                  <Input placeholder="Mô tả" />
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
      )}
    </Form.List>
  );
};

export default Department;