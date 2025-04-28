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

const JobTitle = ({ form }) => {
  const [jobTitles, setJobTitles] = useState([]);

  const handleAddJobTitle = () => {
    const newId = jobTitles.length + 1;
    const updated = [
      ...jobTitles,
      { id: newId, jobTitleCode: "", title: "", rank: null, permissionGroup: null, description: "" }, // Add permissionGroup
    ];
    setJobTitles(updated);
    form.setFieldsValue({ jobTitles: updated });
  };

  const handleJobTitleChange = (index, field, value) => {
    const updated = [...jobTitles];
    updated[index][field] = value;
    setJobTitles(updated);
    form.setFieldsValue({ jobTitles: updated });
  };

  const handleDeleteJobTitle = (index) => {
    const updated = jobTitles
      .filter((_, i) => i !== index)
      .map((job, i) => ({
        ...job,
        id: i + 1,
      }));
    setJobTitles(updated);
    form.setFieldsValue({ jobTitles: updated });
  };

  useEffect(() => {
    const initial = form.getFieldValue("jobTitles") || [];
    setJobTitles(initial);
  }, [form]);

  // Danh sách cấp bậc mẫu
  const ranks = [
    { id: 1, name: "Cấp 1" },
    { id: 2, name: "Cấp 2" },
    { id: 3, name: "Cấp 3" },
    { id: 4, name: "Cấp 4" },
  ];

  // Danh sách nhóm quyền mẫu (có thể thay bằng dữ liệu từ API)
  const permissionGroups = [
    { id: 1, name: "Quản trị viên" },
    { id: 2, name: "Người dùng" },
    { id: 3, name: "Khách" },
  ];

  return (
    <>
      {jobTitles.map((job, index) => (
        <Row gutter={[16, 16]} key={index}>
          <Col xs={24} sm={4}>
            <Form.Item
              label="Mã chức vụ"
              name={["jobTitles", index, "jobTitleCode"]}
              rules={[{ required: true, message: "Vui lòng nhập mã chức vụ" }]}
            >
              <Input
                value={job.jobTitleCode}
                placeholder="Mã chức vụ"
                disabled
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={4}>
            <Form.Item
              label="Tên chức vụ"
              name={["jobTitles", index, "title"]}
              rules={[{ required: true, message: "Vui lòng nhập tên chức vụ" }]}
            >
              <Input
                value={job.title}
                onChange={(e) => handleJobTitleChange(index, "title", e.target.value)}
                placeholder="Tên chức vụ"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={4}>
            <Form.Item
              label="Cấp bậc"
              name={["jobTitles", index, "rank"]}
              rules={[{ required: true, message: "Vui lòng chọn cấp bậc" }]}
            >
              <Select
                value={job.rank}
                onChange={(value) => handleJobTitleChange(index, "rank", value)}
                placeholder="Chọn cấp bậc"
              >
                {ranks.map((rank) => (
                  <Select.Option key={rank.id} value={rank.name}>
                    {rank.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={4}>
            <Form.Item
              label="Nhóm quyền"
              name={["jobTitles", index, "permissionGroup"]}
              rules={[{ required: true, message: "Vui lòng chọn nhóm quyền" }]}
            >
              <Select
                value={job.permissionGroup}
                onChange={(value) => handleJobTitleChange(index, "permissionGroup", value)}
                placeholder="Chọn nhóm quyền"
              >
                {permissionGroups.map((group) => (
                  <Select.Option key={group.id} value={group.name}>
                    {group.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={6}>
            <Form.Item
              label="Mô tả"
              name={["jobTitles", index, "description"]}
            >
              <Input
                value={job.description}
                onChange={(e) => handleJobTitleChange(index, "description", e.target.value)}
                placeholder="Mô tả"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={2} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <DeleteButton onClick={() => handleDeleteJobTitle(index)}>
              Xóa
            </DeleteButton>
          </Col>
        </Row>
      ))}

      <Form.Item>
        <AddButton onClick={handleAddJobTitle} block>
          Thêm mới chức vụ
        </AddButton>
      </Form.Item>
    </>
  );
};

export default JobTitle;