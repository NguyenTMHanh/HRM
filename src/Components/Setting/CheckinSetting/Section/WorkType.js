import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Input, InputNumber, message, Button } from 'antd';
import FooterBar from '../../../Footer/Footer';
import styled from 'styled-components';

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

const WorkType = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [workTypes, setWorkTypes] = useState([]);

  const initialWorkType = {
    workTypeName: 'Toàn thời gian', // Default work type name
    minWorkHours: 8, // Default minimum working hours
    minWorkMinutes: 0, // Default minimum working minutes
  };

  useEffect(() => {
    const initial = form.getFieldValue('workTypes') || [initialWorkType];
    setWorkTypes(initial);
    form.setFieldsValue({ workTypes: initial });
  }, [form]);

  const handleAddWorkType = () => {
    const updated = [...workTypes, { workTypeName: '', minWorkHours: 0, minWorkMinutes: 0 }];
    setWorkTypes(updated);
    form.setFieldsValue({ workTypes: updated });
  };

  const handleWorkTypeChange = (index, field, value) => {
    const updated = [...workTypes];
    updated[index][field] = value;
    setWorkTypes(updated);
    form.setFieldsValue({ workTypes: updated });
  };

  const handleDeleteWorkType = (index) => {
    const updated = workTypes.filter((_, i) => i !== index);
    setWorkTypes(updated);
    form.setFieldsValue({ workTypes: updated });
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

      const formattedValues = values.workTypes.map((workType) => ({
        workTypeName: workType.workTypeName || null,
        minWorkTime: workType.minWorkHours || workType.minWorkMinutes
          ? `${workType.minWorkHours || 0}h${workType.minWorkMinutes || 0}m`
          : null,
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
        {workTypes.map((workType, index) => (
          <Row gutter={[16, 16]} key={index} align="middle">
            <Col xs={24} sm={12}>
              <Form.Item
                label="Tên loại hình làm việc"
                name={['workTypes', index, 'workTypeName']}
                rules={[{ required: true, message: 'Vui lòng nhập tên loại hình làm việc!' }]}
              >
                <Input
                  placeholder="Nhập tên loại hình làm việc"
                  style={{ width: '100%' }}
                  disabled={!isEditing}
                  onChange={(e) => handleWorkTypeChange(index, 'workTypeName', e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={10}>
              <Form.Item
                label="Thời gian làm việc tối thiểu"
                required
              >
                <Row gutter={[8, 8]} style={{ flexWrap: 'nowrap' }} justify="start">
                  <Col xs={24} sm={12} style={{ display: 'flex', alignItems: 'center' }}>
                    <Form.Item
                      name={['workTypes', index, 'minWorkHours']}
                      rules={[{ required: true, message: 'Vui lòng nhập số giờ!' }]}
                      noStyle
                    >
                      <InputNumber
                        min={0}
                        max={23}
                        placeholder="Giờ"
                        disabled={!isEditing}
                        style={{ width: '100%' }}
                        onChange={(value) => handleWorkTypeChange(index, 'minWorkHours', value)}
                      />
                    </Form.Item>
                    <span style={{ margin: '0 8px', whiteSpace: 'nowrap' }}>giờ</span>
                  </Col>
                  <Col xs={24} sm={12} style={{ display: 'flex', alignItems: 'center' }}>
                    <Form.Item
                      name={['workTypes', index, 'minWorkMinutes']}
                      rules={[{ required: true, message: 'Vui lòng nhập số phút!' }]}
                      noStyle
                    >
                      <InputNumber
                        min={0}
                        max={59}
                        placeholder="Phút"
                        disabled={!isEditing}
                        style={{ width: '100%' }}
                        onChange={(value) => handleWorkTypeChange(index, 'minWorkMinutes', value)}
                      />
                    </Form.Item>
                    <span style={{ margin: '0 8px', whiteSpace: 'nowrap' }}>phút</span>
                  </Col>
                </Row>
              </Form.Item>
            </Col>
            <Col xs={24} sm={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isEditing && (
                <DeleteButton onClick={() => handleDeleteWorkType(index)}>
                  Xóa
                </DeleteButton>
              )}
            </Col>
          </Row>
        ))}
        {isEditing && (
          <Form.Item>
            <AddButton onClick={handleAddWorkType} block>
              Thêm mới loại hình làm việc
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

export default WorkType;