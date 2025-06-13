import React, { useState, useEffect } from 'react';
import { Input, Button, Row, Col, Select, Form, DatePicker, Upload, message } from 'antd';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import moment from 'moment';
import axios from 'axios';

const DeleteButton = styled(Button)`
  background-color: #f5222d;
  border-color: #f5222d;
  color: white;
  border-radius: 4px;
  padding: 8px 16px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #d42a2a;
    border-color: #d42a2a;
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }
`;

const AddButton = styled(Button)`
  background-color: #001b45;
  border-color: #001b45;
  color: white;
  border-radius: 4px;
  padding: 8px 16px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #002d72 !important;
    border-color: #002d72;
    color: white !important;
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }
`;

const StyledUpload = styled(Upload)`
  display: block;

  .ant-upload {
    width: 100% !important;
  }

  .ant-btn {
    width: 100% !important;
    text-align: left;
  }
`;

const Dependent = ({ form, disabled }) => {
  const relationshipOptions = [
    { label: 'Con', value: 'Con' },
    { label: 'Cha/Mẹ', value: 'Cha/Mẹ' },
    { label: 'Vợ/Chồng', value: 'Vợ/Chồng' },
    { label: 'Khác', value: 'Khác' },
  ];

  // State to store fileList and file IDs for each dependent
  const [fileLists, setFileLists] = useState({});
  const [fileIds, setFileIds] = useState({}); // Store file IDs
  const [uploadLoading, setUploadLoading] = useState({}); // Track loading state per index

  // Upload file to server
  const uploadProofFile = async (file, index) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadLoading((prev) => ({ ...prev, [index]: true }));

      // Create a new axios instance for upload
      const uploadAxios = axios.create({
        baseURL: axios.defaults.baseURL,
      });

      const token = localStorage.getItem('accessToken');
      const uploadConfig = {
        headers: {},
      };

      if (token) {
        uploadConfig.headers.Authorization = `Bearer ${token}`;
      }

      const response = await uploadAxios.post('/api/FileUpload/UploadFile', formData, uploadConfig);

      if (response.status === 200) {
        const { id, fileName } = response.data;
        return { id, fileName };
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload proof file error:', error);
      message.error(error.response?.data?.message || 'Tải hồ sơ minh chứng thất bại!');
      throw error;
    } finally {
      setUploadLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  // Handle file upload change
  const handleUploadChange = async (index, info) => {
    const file = info.file;
    const newFileLists = { ...fileLists, [index]: [file] };
    setFileLists(newFileLists);

    if (file.status !== 'removed') {
      try {
        const { id, fileName } = await uploadProofFile(file, index);
        // Update file ID in state
        setFileIds((prev) => ({ ...prev, [index]: id }));

        // Update form field with file ID and URL
        const currentDependents = form.getFieldValue('dependents') || [];
        currentDependents[index] = {
          ...currentDependents[index],
          proofFile: [{
            uid: id,
            name: fileName,
            status: 'done',
            url: URL.createObjectURL(file), // Hiển thị ảnh ngay sau khi upload
            fileId: id,
          }],
        };
        form.setFieldsValue({ dependents: currentDependents });

        message.success('Tải hồ sơ minh chứng thành công!');
      } catch (error) {
        // Remove file from fileList if upload fails
        setFileLists((prev) => ({ ...prev, [index]: [] }));
      }
    } else {
      // Handle file removal
      setFileLists((prev) => ({ ...prev, [index]: [] }));
      setFileIds((prev) => {
        const newFileIds = { ...prev };
        delete newFileIds[index];
        return newFileIds;
      });

      const currentDependents = form.getFieldValue('dependents') || [];
      currentDependents[index] = {
        ...currentDependents[index],
        proofFile: [],
      };
      form.setFieldsValue({ dependents: currentDependents });
    }
  };

  // Sync fileLists and fileIds with Form.List when fields change
  useEffect(() => {
    const currentDependents = form.getFieldValue('dependents') || [];
    const newFileLists = {};
    const newFileIds = {};
    currentDependents.forEach((dep, index) => {
      if (dep && dep.proofFile && dep.proofFile.length > 0) {
        newFileIds[index] = dep.proofFile[0].fileId;
        newFileLists[index] = dep.proofFile.map((file) => ({
          uid: file.uid || `-${index}`,
          name: file.name || 'File',
          status: 'done',
          url: file.url, // Giữ URL từ initialData
          fileId: file.fileId,
        }));
      } else {
        newFileLists[index] = [];
      }
    });
    setFileLists(newFileLists);
    setFileIds(newFileIds);
  }, [form]);

  return (
    <Form.List name="dependents">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }, index) => (
            <Row gutter={[16, 16]} key={key}>
              <Col xs={24} sm={6}>
                <Form.Item
                  {...restField}
                  label="Tình trạng đăng ký"
                  name={[name, 'registered']}
                  rules={[{ required: true, message: 'Vui lòng chọn tình trạng!' }]}
                  initialValue="Đã đăng ký"
                >
                  <Select
                    options={[
                      { label: 'Đã đăng ký', value: 'Đã đăng ký' },
                      { label: 'Chưa đăng ký', value: 'Chưa đăng ký' },
                    ]}
                    disabled={disabled}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={6}>
                <Form.Item
                  {...restField}
                  label="Mã số thuế"
                  name={[name, 'taxCode']}
                  rules={[{ pattern: /^[0-9]*$/, message: 'Chỉ được nhập số!' }]}
                >
                  <Input placeholder="Nhập mã số thuế (nếu có)" disabled={disabled} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={6}>
                <Form.Item
                  {...restField}
                  label="Họ và tên"
                  name={[name, 'fullName']}
                  rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                >
                  <Input placeholder="Nhập họ và tên" disabled={disabled} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={6}>
                <Form.Item
                  {...restField}
                  label="Ngày sinh"
                  name={[name, 'birthDate']}
                  rules={[
                    { required: true, message: 'Vui lòng chọn ngày sinh!' },
                    {
                      validator: (_, value) =>
                        value && value.isBefore(moment())
                          ? Promise.resolve()
                          : Promise.reject('Ngày sinh phải là ngày trong quá khứ!'),
                    },
                  ]}
                >
                  <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} disabled={disabled} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={6}>
                <Form.Item
                  {...restField}
                  label="Mối quan hệ"
                  name={[name, 'relationship']}
                  rules={[{ required: true, message: 'Vui lòng chọn mối quan hệ!' }]}
                >
                  <Select placeholder="Chọn mối quan hệ" options={relationshipOptions} disabled={disabled} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={8}>
                <Form.Item
                  {...restField}
                  label="Hồ sơ minh chứng"
                  name={[name, 'proofFile']}
                  rules={[{ required: true, message: 'Vui lòng tải lên hồ sơ minh chứng!' }]}
                  valuePropName="fileList"
                  getValueFromEvent={(e) => {
                    if (Array.isArray(e)) {
                      return e;
                    }
                    return e && e.fileList;
                  }}
                >
                  <StyledUpload
                    listType="picture"
                    maxCount={1}
                    fileList={fileLists[index] || []}
                    onChange={(info) => handleUploadChange(index, info)}
                    disabled={disabled || uploadLoading[index]}
                    beforeUpload={() => false} // Ngăn upload tự động
                    accept="image/*"
                  >
                    <Button
                      icon={uploadLoading[index] ? <LoadingOutlined /> : <UploadOutlined />}
                      disabled={disabled || uploadLoading[index]}
                    >
                      {fileLists[index] && fileLists[index].length > 0
                        ? fileLists[index][0].name
                        : 'Tải lên'}
                    </Button>
                  </StyledUpload>
                </Form.Item>
              </Col>

              <Col xs={24} sm={2} style={{ display: 'flex', alignItems: 'center' }}>
                {!disabled && (
                  <DeleteButton onClick={() => remove(name)}>Xóa</DeleteButton>
                )}
              </Col>
            </Row>



            
          ))}

          {!disabled && (
            <Form.Item>
              <AddButton
                onClick={() => {
                  add();
                  setFileLists((prev) => {
                    const newFileLists = { ...prev };
                    fields.forEach((field, idx) => {
                      if (!newFileLists[idx]) newFileLists[idx] = [];
                    });
                    return newFileLists;
                  });
                }}
                block
              >
                Thêm người phụ thuộc
              </AddButton>
            </Form.Item>
          )}
        </>
      )}
    </Form.List>
  );
};

export default Dependent;