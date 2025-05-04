import React from 'react';
import { Form, Input, Row, Col, Select } from 'antd';

const { Option } = Select;

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

const BranchInfo = ({ form, isViewMode }) => {
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
            background-color: #f5f5f5 
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
        <Col xs={24} sm={4}>
          <Form.Item
            label="Mã chi nhánh"
            name="branchCode"
            rules={[{ required: true, message: 'Vui lòng nhập mã chi nhánh!' }]}
          >
            <Input placeholder="Nhập mã chi nhánh" disabled />
          </Form.Item>
        </Col>

        <Col xs={24} sm={5}>
          <Form.Item
            label="Tên chi nhánh"
            name="branchName"
            rules={[{ required: true, message: 'Vui lòng nhập tên chi nhánh!' }]}
          >
            <Input placeholder="Nhập tên chi nhánh" disabled={isViewMode} />
          </Form.Item>
        </Col>

        <Col xs={24} sm={5}>
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input placeholder="Nhập địa chỉ chi nhánh" disabled={isViewMode} />
          </Form.Item>
        </Col>

        <Col xs={24} sm={5}>
          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select placeholder="Chọn trạng thái" disabled={isViewMode}>
              <Option value="active">Đang hoạt động</Option>
              <Option value="inactive">Ngừng hoạt động</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={5}>
          <Form.Item
            label="Bộ phận"
            name="departments"
            rules={[{ required: true, message: 'Vui lòng chọn ít nhất một bộ phận!' }]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn các bộ phận"
              allowClear
              disabled={isViewMode}
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
    </div>
  );
};

export default BranchInfo;