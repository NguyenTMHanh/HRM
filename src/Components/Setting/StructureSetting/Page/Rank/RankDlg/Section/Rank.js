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

const Rank = ({ form }) => {
  const [ranks, setRanks] = useState([]);

  const handleAddRank = () => {
    const newPriority = ranks.length + 1;
    const updated = [
      ...ranks,
      { rankCode: "", priority: newPriority, name: "", description: "" }
    ];
    setRanks(updated);
    form.setFieldsValue({ ranks: updated });
  };

  const handleRankChange = (index, field, value) => {
    const updated = [...ranks];
    updated[index][field] = value;
    setRanks(updated);
    form.setFieldsValue({ ranks: updated });
  };

  const handleDeleteRank = (index) => {
    const updated = ranks.filter((_, i) => i !== index).map((rank, i) => ({
      ...rank,
      priority: i + 1,
    }));
    setRanks(updated);
    form.setFieldsValue({ ranks: updated });
  };

  useEffect(() => {
    const initial = form.getFieldValue("ranks") || [];
    setRanks(initial);
  }, [form]);

  return (
    <>
      {ranks.map((rank, index) => (
        <Row gutter={[16, 16]} key={index}>
          <Col xs={24} sm={6}>
            <Form.Item
              label="Mã cấp bậc"
              name={["ranks", index, "rankCode"]}
              rules={[{ required: true, message: "Vui lòng nhập mã cấp bậc" }]}
            >
              <Input
                value={rank.rankCode}
                placeholder="Mã cấp bậc"
                disabled
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={4}>
            <Form.Item
              label="Mức độ ưu tiên"
              name={["ranks", index, "priority"]}
              rules={[{ required: true, message: "Vui lòng nhập mức độ ưu tiên" }]}
            >
              <Input
                type="number"
                value={rank.priority}
                onChange={(e) => handleRankChange(index, "priority", parseInt(e.target.value))}
                placeholder="Mức độ ưu tiên"
                min={1}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={6}>
            <Form.Item
              label="Tên cấp bậc"
              name={["ranks", index, "name"]}
              rules={[{ required: true, message: "Vui lòng nhập tên cấp bậc" }]}
            >
              <Input
                value={rank.name}
                onChange={(e) => handleRankChange(index, "name", e.target.value)}
                placeholder="Tên cấp bậc"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={6}>
            <Form.Item
              label="Mô tả"
              name={["ranks", index, "description"]}
            >
              <Input
                value={rank.description}
                onChange={(e) => handleRankChange(index, "description", e.target.value)}
                placeholder="Mô tả"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={2} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <DeleteButton onClick={() => handleDeleteRank(index)}>
              Xóa
            </DeleteButton>
          </Col>
        </Row>
      ))}

      <Form.Item>
        <AddButton onClick={handleAddRank} block>
          Thêm mới cấp bậc
        </AddButton>
      </Form.Item>
    </>
  );
};

export default Rank;