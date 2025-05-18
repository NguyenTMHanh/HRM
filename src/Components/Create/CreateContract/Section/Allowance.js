import React from "react";
import { Form, Select, Input, Button, Row, Col } from "antd";
import styled from "styled-components";

const DeleteButton = styled(Button)`
  background-color: #f5222d;
  border-color: #f5222d;
  color: white;
  border-radius: 4px;
  padding: 8px 16px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #d42a2a;
    border-color: #d42a2a;
    color: white !important;
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }
`;

const AddButton = styled(Button)`
  background-color: #001b45;
  border-color: #001b45;
  color: white;
  border-radius: 4px;
  padding: 8px 16px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #002d72 !important;
    border-color: #002d72;
    color: white !important;
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }
`;

const Allowance = ({ form }) => {
  const allowanceOptions = [
    { label: "Phụ cấp ăn trưa", value: "Phụ cấp ăn trưa", amount: "1,000,000 VNĐ" },
    { label: "Phụ cấp đi lại", value: "Phụ cấp đi lại", amount: "2,000,000 VNĐ" },
    { label: "Phụ cấp điện thoại", value: "Phụ cấp điện thoại", amount: "3,000,000 VNĐ" },
    { label: "Phụ cấp nhà ở", value: "Phụ cấp nhà ở", amount: "1,500,000 VNĐ" },
  ];

  const getAmountByName = (name) => {
    const found = allowanceOptions.find((item) => item.value === name);
    return found?.amount || "";
  };

  return (
    <Form.List name="allowances">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <Row gutter={[16, 16]} key={key}>
              <Col xs={24} sm={11}>
                <Form.Item
                  {...restField}
                  label="Tên phụ cấp"
                  name={[name, "name"]}
                  rules={[{ required: true, message: "Vui lòng chọn tên phụ cấp!" }]}
                >
                  <Select
                    placeholder="Chọn tên phụ cấp"
                    options={allowanceOptions}
                    onChange={(value) => {
                      form.setFieldsValue({
                        allowances: form
                          .getFieldValue("allowances")
                          .map((item, idx) =>
                            idx === name ? { ...item, amount: getAmountByName(value) } : item
                          ),
                      });
                    }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={11}>
                <Form.Item
                  {...restField}
                  label="Mức phụ cấp"
                  name={[name, "amount"]}
                  rules={[{ required: true, message: "Mức phụ cấp không được để trống!" }]}
                >
                  <Input placeholder="Mức phụ cấp" disabled />
                </Form.Item>
              </Col>

              <Col xs={24} sm={2} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <DeleteButton onClick={() => remove(name)}>Xóa</DeleteButton>
              </Col>
            </Row>
          ))}

          <Form.Item>
            <AddButton onClick={() => add()} block>
              Thêm mới phụ cấp
            </AddButton>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};

export default Allowance;