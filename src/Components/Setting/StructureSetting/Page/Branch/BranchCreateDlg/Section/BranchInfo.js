import React from 'react';
import { Form, Input, Row, Col, Select } from 'antd';

const { Option } = Select;

// Predefined list of departments (you can adjust this list as needed)
const departmentOptions = [
  "Kế toán",
  "Nhân sự",
  "Kinh doanh",
  "Kỹ thuật",
  "Marketing",
  "Dịch vụ khách hàng",
  "Phát triển sản phẩm",
  "Hậu cần",
  "Quản lý chất lượng",
];

const BranchInfo = ({ form }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={6}>
        <Form.Item
          label="Tên chi nhánh"
          name="branchName"
          rules={[{ required: true, message: 'Vui lòng nhập tên chi nhánh!' }]}
        >
          <Input placeholder="Nhập tên chi nhánh" />
        </Form.Item>
      </Col>

      <Col xs={24} sm={6}>
        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
        >
          <Input placeholder="Nhập địa chỉ chi nhánh" />
        </Form.Item>
      </Col>

      <Col xs={24} sm={6}>
        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Option value="active">Đang hoạt động</Option>
            <Option value="inactive">Ngừng hoạt động</Option>
          </Select>
        </Form.Item>
      </Col>

      <Col xs={24} sm={6}>
        <Form.Item
          label="Bộ phận"
          name="departments"
          rules={[{ required: true, message: 'Vui lòng chọn ít nhất một bộ phận!' }]}
        >
          <Select
            mode="multiple"
            placeholder="Chọn các bộ phận"
            allowClear
            style={{ width: '100%' }}
          >
            {departmentOptions.map((dept) => (
              <Option key={dept} value={dept}>
                {dept}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
    </Row>
  );
};

export default BranchInfo;