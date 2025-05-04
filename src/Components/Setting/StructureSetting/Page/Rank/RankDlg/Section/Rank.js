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

const Rank = ({ form, isViewMode }) => {
  const handleAddRank = () => {
    const currentRanks = form.getFieldValue("ranks") || [];
    const newPriority = currentRanks.length + 1;
    const updated = [
      ...currentRanks,
      { rankCode: `R${String(newPriority).padStart(3, "0")}`, priority: newPriority, name: "", description: "" },
    ];
    form.setFieldsValue({ ranks: updated });
  };

  const handleDeleteRank = (index) => {
    const currentRanks = form.getFieldValue("ranks") || [];
    const updated = currentRanks
      .filter((_, i) => i !== index)
      .map((rank, i) => ({
        ...rank,
        priority: i + 1,
        rankCode: `R${String(i + 1).padStart(3, "0")}`,
      }));
    form.setFieldsValue({ ranks: updated });
  };

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
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => (
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

                <Col xs={24} sm={4}>
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

                <Col xs={24} sm={2} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {!isViewMode && (
                    <DeleteButton onClick={() => handleDeleteRank(index)}>Xóa</DeleteButton>
                  )}
                </Col>
              </Row>
            ))}

            {!isViewMode && (
              <Form.Item>
                <AddButton onClick={handleAddRank} block>
                  Thêm mới cấp bậc
                </AddButton>
              </Form.Item>
            )}
          </>
        )}
      </Form.List>
    </div>
  );
};

export default Rank;