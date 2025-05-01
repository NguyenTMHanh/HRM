import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Input, DatePicker, message, Button } from 'antd';
import FooterBar from '../../../Footer/Footer';
import styled from 'styled-components';
import moment from 'moment';

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

const Holiday = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [holidays, setHolidays] = useState([]);

  const initialHoliday = {
    holidayName: 'Tết Nguyên Đán', // Default holiday name
    startDate: moment('2025-01-29'), // Default start date (Tết 2025)
    endDate: moment('2025-02-03'), // Default end date (Tết 2025)
  };

  useEffect(() => {
    const initial = form.getFieldValue('holidays') || [initialHoliday];
    setHolidays(initial);
    form.setFieldsValue({ holidays: initial });
  }, [form]);

  const handleAddHoliday = () => {
    const updated = [...holidays, { holidayName: '', startDate: null, endDate: null }];
    setHolidays(updated);
    form.setFieldsValue({ holidays: updated });
  };

  const handleHolidayChange = (index, field, value) => {
    const updated = [...holidays];
    updated[index][field] = value;
    setHolidays(updated);
    form.setFieldsValue({ holidays: updated });
  };

  const handleDeleteHoliday = (index) => {
    const updated = holidays.filter((_, i) => i !== index);
    setHolidays(updated);
    form.setFieldsValue({ holidays: updated });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    form.resetFields();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const formattedValues = values.holidays.map((holiday) => ({
        holidayName: holiday.holidayName || null,
        startDate: holiday.startDate ? holiday.startDate.format('DD/MM/YYYY') : null,
        endDate: holiday.endDate ? holiday.endDate.format('DD/MM/YYYY') : null,
      }));

      console.log('Saved values:', formattedValues);
      setIsEditing(false);
      message.success('Lưu dữ liệu thành công!');
    } catch (error) {
      console.log('Validation failed:', error);
      message.error('Lưu thất bại! Vui lòng nhập đầy đủ các trường bắt buộc.');
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <Form form={form} layout="vertical">
        {holidays.map((holiday, index) => (
          <Row gutter={[16, 16]} key={index} align="middle">
            <Col xs={24} sm={12}>
              <Form.Item
                label="Tên ngày lễ"
                name={['holidays', index, 'holidayName']}
                rules={[{ required: true, message: 'Vui lòng nhập tên ngày lễ!' }]}
              >
                <Input
                  placeholder="Nhập tên ngày lễ"
                  style={{ width: '100%' }}
                  disabled={!isEditing}
                  onChange={(e) => handleHolidayChange(index, 'holidayName', e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={10}>
              <Form.Item
                label="Thời gian nghỉ"
                required
              >
                <Row gutter={[8, 8]} style={{ flexWrap: 'nowrap' }} justify="start">
                  <Col xs={24} sm={12} style={{ display: 'flex', alignItems: 'center' }}>
                    <Form.Item
                      name={['holidays', index, 'startDate']}
                      rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                      noStyle
                    >
                      <DatePicker
                        placeholder="Ngày bắt đầu"
                        disabled={!isEditing}
                        style={{ width: '100%' }}
                        onChange={(date) => handleHolidayChange(index, 'startDate', date)}
                        format="DD/MM/YYYY"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} style={{ display: 'flex', alignItems: 'center' }}>
                    <Form.Item
                      name={['holidays', index, 'endDate']}
                      rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
                      noStyle
                    >
                      <DatePicker
                        placeholder="Ngày kết thúc"
                        disabled={!isEditing}
                        style={{ width: '100%' }}
                        onChange={(date) => handleHolidayChange(index, 'endDate', date)}
                        format="DD/MM/YYYY"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>
            </Col>
            <Col xs={24} sm={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isEditing && (
                <DeleteButton onClick={() => handleDeleteHoliday(index)}>
                  Xóa
                </DeleteButton>
              )}
            </Col>
          </Row>
        ))}
        {isEditing && (
          <Form.Item>
            <AddButton onClick={handleAddHoliday} block>
              Thêm mới ngày lễ
            </AddButton>
          </Form.Item>
        )}
      </Form>
      <FooterBar
        isModalFooter={true}
        showEdit={!isEditing}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onSave={handleSave}
        isEditing={isEditing}
        showSave={isEditing}
        showCancel={isEditing}
      />
    </div>
  );
};

export default Holiday;