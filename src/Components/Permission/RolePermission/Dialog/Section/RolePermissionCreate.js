import React from 'react';
import { Form, Input, Row, Col, Select } from 'antd';

const { Option } = Select;

const positionOptions = [
  "Quản lý",
  "Nhân viên",
  "Trưởng phòng",
  "Phó phòng",
  "Kế toán trưởng",
  "Chuyên viên",
  "Giám đốc",
  "Phó giám đốc",
];

const RolePermissionCreate = ({ form }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={6}>
        <Form.Item
          label="Mã nhóm quyền"
          name="roleCode"
          rules={[{ required: true, message: 'Vui lòng nhập mã nhóm quyền!' }]}
        >
          <Input
            placeholder="Nhập mã nhóm quyền"
            disabled 
          />
        </Form.Item>
      </Col>

      <Col xs={24} sm={6}>
        <Form.Item
          label="Tên nhóm quyền"
          name="roleName"
          rules={[{ required: true, message: 'Vui lòng nhập tên nhóm quyền!' }]}
        >
          <Input placeholder="Nhập tên nhóm quyền" />
        </Form.Item>
      </Col>

      <Col xs={24} sm={6}>
        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: false }]}
        >
          <Input placeholder="Nhập mô tả"/>
        </Form.Item>
      </Col>

      <Col xs={24} sm={6}>
        <Form.Item
          label="Chức vụ"
          name="position"
          rules={[{ required: true, message: 'Vui lòng chọn chức vụ!' }]}
        >
          <Select
            placeholder="Chọn chức vụ"
            allowClear
            style={{ width: '100%' }}
          >
            {positionOptions.map((position) => (
              <Option key={position} value={position}>
                {position}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
    </Row>
  );
};

export default RolePermissionCreate;