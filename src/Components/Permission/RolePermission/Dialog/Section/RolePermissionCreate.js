import React from "react";
import { Form, Input, Row, Col } from "antd";

const RolePermissionCreate = ({ form, isViewMode }) => {
  return (
    <div className={isViewMode ? "view-mode" : "edit-mode"}>
      <style>
        {`
          .view-mode .ant-input-disabled {
            background-color: white !important;
            color: rgba(0, 0, 0, 0.85) !important;
            cursor: not-allowed;
          }

          .edit-mode .ant-input-disabled {
            background-color: #f5f5f5 !important; 
            color: #C4C4C4 !important; 
            cursor: not-allowed;
          }

          .view-mode .ant-select-disabled .ant-select-selector {
            background-color: white !important;
            color: rgba(0, 0, 0, 0.85) !important; 
            cursor: not-allowed;
            border-color: #d9d9d9 !important;
          }

          .edit-mode .ant-select-disabled .ant-select-selector {
            background-color: #f5f5f5 !important; 
            color: #C4C4C4 !important; 
            cursor: not-allowed;
            border-color: #d9d9d9 !important; 
          }

          .ant-select-disabled .ant-select-arrow {
            color: rgba(0, 0, 0, 0.85) !important; 
          }
        `}
      </style>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Form.Item
            label="Mã nhóm quyền"
            name="roleCode"
            rules={[{ required: true, message: "Vui lòng nhập mã nhóm quyền!" }]}
          >
            <Input placeholder="Nhập mã nhóm quyền" disabled />
          </Form.Item>
        </Col>

        <Col xs={24} sm={8}>
          <Form.Item
            label="Tên nhóm quyền"
            name="roleName"
            rules={[{ required: true, message: "Vui lòng nhập tên nhóm quyền!" }]}
          >
            <Input placeholder="Nhập tên nhóm quyền" disabled={isViewMode} />
          </Form.Item>
        </Col>

        <Col xs={24} sm={8}>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: false }]}
          >
            <Input placeholder="Nhập mô tả" disabled={isViewMode} />
          </Form.Item>
        </Col>

      </Row>
    </div>
  );
};

export default RolePermissionCreate;