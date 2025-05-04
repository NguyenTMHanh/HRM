import React from "react";
import { Input, Button, Row, Col, Form, Select } from "antd";
import styled from "styled-components";

const { Option } = Select;

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

const JobTitle = ({ form, isViewMode }) => {
  const handleAddJobTitle = () => {
    const currentJobTitles = form.getFieldValue("jobTitles") || [];
    const newId = currentJobTitles.length + 1;
    form.setFieldsValue({
      jobTitles: [
        ...currentJobTitles,
        {
          id: newId,
          jobTitleCode: `JT${newId.toString().padStart(3, "0")}`,
          title: "",
          rank: null,
          permissionGroup: null,
          description: "",
        },
      ],
    });
  };

  const handleDeleteJobTitle = (index) => {
    const currentJobTitles = form.getFieldValue("jobTitles") || [];
    const updated = currentJobTitles
      .filter((_, i) => i !== index)
      .map((title, i) => ({
        ...title,
        id: i + 1,
        jobTitleCode: `JT${(i + 1).toString().padStart(3, "0")}`,
      }));
    form.setFieldsValue({ jobTitles: updated });
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
      <Form.List name="jobTitles">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => (
              <Row gutter={[16, 16]} key={key}>
                <Col xs={24} sm={4}>
                  <Form.Item
                    {...restField}
                    label="Mã chức vụ"
                    name={[name, "jobTitleCode"]}
                    rules={[{ required: true, message: "Vui lòng nhập mã chức vụ" }]}
                  >
                    <Input placeholder="Mã chức vụ" disabled />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={6}>
                  <Form.Item
                    {...restField}
                    label="Tên chức vụ"
                    name={[name, "title"]}
                    rules={[{ required: true, message: "Vui lòng nhập tên chức vụ" }]}
                  >
                    <Input placeholder="Tên chức vụ" disabled={isViewMode} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={4}>
                  <Form.Item
                    {...restField}
                    label="Cấp bậc"
                    name={[name, "rank"]}
                    rules={[{ required: true, message: "Vui lòng chọn cấp bậc" }]}
                  >
                    <Select placeholder="Chọn cấp bậc" disabled={isViewMode}>
                      <Option value="Cấp 1">Cấp 1</Option>
                      <Option value="Cấp 2">Cấp 2</Option>
                      <Option value="Cấp 3">Cấp 3</Option>
                      <Option value="Cấp 4">Cấp 4</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={4}>
                  <Form.Item
                    {...restField}
                    label="Nhóm quyền"
                    name={[name, "permissionGroup"]}
                    rules={[{ required: true, message: "Vui lòng chọn nhóm quyền" }]}
                  >
                    <Select placeholder="Chọn nhóm quyền" disabled={isViewMode}>
                      <Option value="Quản trị viên">Quản trị viên</Option>
                      <Option value="Người dùng">Người dùng</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={4}>
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
                    <DeleteButton onClick={() => handleDeleteJobTitle(index)}>Xóa</DeleteButton>
                  )}
                </Col>
              </Row>
            ))}
            {!isViewMode && (
              <Form.Item>
                <AddButton onClick={handleAddJobTitle} block>
                  Thêm mới chức vụ
                </AddButton>
              </Form.Item>
            )}
          </>
        )}
      </Form.List>
    </div>
  );
};

export default JobTitle;