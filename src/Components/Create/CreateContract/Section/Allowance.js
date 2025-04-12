import React, { useState, useEffect } from "react";
import { Input, Button, Row, Col, Select, Form } from "antd";
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

const Allowance = ({ form }) => {
  const [allowances, setAllowances] = useState([]);

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

  const handleAddAllowance = () => {
    const updated = [...allowances, { name: "", amount: "" }];
    setAllowances(updated);
    form.setFieldsValue({ allowances: updated });
  };

  const handleAllowanceChange = (index, field, value) => {
    const updated = [...allowances];
    updated[index][field] = value;
    if (field === "name") {
      updated[index].amount = getAmountByName(value);
    }
    setAllowances(updated);
    form.setFieldsValue({ allowances: updated });
  };

  const handleDeleteAllowance = (index) => {
    const updated = allowances.filter((_, i) => i !== index);
    setAllowances(updated);
    form.setFieldsValue({ allowances: updated });
  };

  useEffect(() => {
    const initial = form.getFieldValue("allowances") || [];
    setAllowances(initial);
  }, [form]);

  return (
    <>
      {allowances.map((allowance, index) => (
        <Row gutter={[16, 16]} key={index}>
          <Col xs={24} sm={11}>
            <Form.Item
              label="Tên phụ cấp"
              name={["allowances", index, "name"]}
            >
              <Select
                value={allowance.name}
                onChange={(val) => handleAllowanceChange(index, "name", val)}
                placeholder="Chọn tên phụ cấp"
                options={allowanceOptions}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={11}>
            <Form.Item
              label="Mức phụ cấp"
              name={["allowances", index, "amount"]}
            >
              <Input value={allowance.amount} placeholder="Mức phụ cấp" disabled />
            </Form.Item>
          </Col>

          <Col xs={24} sm={2} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <DeleteButton onClick={() => handleDeleteAllowance(index)}>
              Xóa
            </DeleteButton>
          </Col>
        </Row>
      ))}

      <Form.Item>
        <AddButton onClick={handleAddAllowance} block>
          Thêm mới phụ cấp
        </AddButton>
      </Form.Item>
    </>
  );
};

export default Allowance;