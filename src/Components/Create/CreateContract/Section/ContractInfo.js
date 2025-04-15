import React from 'react';
import { Form, Input, Row, Col, Select, DatePicker } from 'antd';
import moment from 'moment';

const ContractInfo = ({ form }) => {
  const disabledStartDate = (current) => {
    return current && current < moment().startOf('day');
  };

  const disabledEndDate = (current) => {
    const startDate = form.getFieldValue('startDate');
    return current && current < moment(startDate).startOf('day');
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={6}>
        <Form.Item
          label="Mã số HĐLĐ"
          name="contractId"
          rules={[{ required: true, message: 'Vui lòng nhập mã số HĐLĐ!' }]}
        >
          <Input placeholder="Nhập mã số hợp đồng" disabled />
        </Form.Item>
      </Col>

      <Col xs={24} sm={6}>
        <Form.Item label="Loại hợp đồng" name="contractType">
          <Select placeholder="Chọn loại hợp đồng">
            <Select.Option value="HĐLĐ không xác định thời hạn">
              HĐLĐ không xác định thời hạn
            </Select.Option>
            <Select.Option value="HĐLĐ xác định thời hạn">
              HĐLĐ xác định thời hạn
            </Select.Option>
          </Select>
        </Form.Item>
      </Col>

      <Col xs={24} sm={6}>
        <Form.Item label="Ngày bắt đầu HĐ" name="startDate">
          <DatePicker
            format="DD/MM/YYYY"
            disabledDate={disabledStartDate}
            placeholder="Chọn ngày bắt đầu hợp đồng"
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Col>

      <Col xs={24} sm={6}>
        <Form.Item label="Ngày kết thúc HĐ" name="endDate">
          <DatePicker
            format="DD/MM/YYYY"
            disabledDate={disabledEndDate}
            placeholder="Chọn ngày kết thúc hợp đồng"
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Col>

      <Col xs={24} sm={6}>
        <Form.Item label="Tình trạng" name="status">
          <Select placeholder="Chọn tình trạng">
            <Select.Option value="Còn hiệu lực">Còn hiệu lực</Select.Option>
            <Select.Option value="Hết hiệu lực">Hết hiệu lực</Select.Option>
          </Select>
        </Form.Item>
      </Col>

      <Col xs={24} sm={6}>
        <Form.Item
          label="Mức lương/1h"
          name="hourlyWage"
          rules={[{ required: true, message: 'Vui lòng nhập mức lương/1h!' }]}
        >
          <Input placeholder="Nhập mức lương/1 giờ" disabled />
        </Form.Item>
      </Col>

      <Col xs={24} sm={6}>
        <Form.Item
          label="Số giờ làm việc chuẩn/1 ngày"
          name="workHoursPerDay"
          rules={[{ required: true, message: 'Vui lòng nhập số giờ làm việc chuẩn/1 ngày!' }]}
        >
          <Input placeholder="Nhập số giờ làm việc chuẩn/1 ngày" disabled />
        </Form.Item>
      </Col>

      <Col xs={24} sm={6}>
        <Form.Item label="Vị trí" name="position">
          <Input placeholder="Nhập vị trí công việc" disabled />
        </Form.Item>
      </Col>

      <Col xs={24} sm={6}>
        <Form.Item label="Hệ số lương" name="salaryCoefficient">
          <Input placeholder="Nhập hệ số lương" disabled />
        </Form.Item>
      </Col>

      <Col xs={24} sm={6}>
        <Form.Item label="Ngày công chuẩn" name="standardWorkingDays">
          <Input placeholder="Nhập số ngày công chuẩn" disabled />
        </Form.Item>
      </Col>

      <Col xs={24} sm={6}>
        <Form.Item label="Tiền lương cơ bản" name="basicSalary">
          <Input placeholder="Nhập tiền lương cơ bản" disabled />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default ContractInfo;