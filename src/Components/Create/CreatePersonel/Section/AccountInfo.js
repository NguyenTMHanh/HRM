import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Form, Input, Select, Row, Col, Button, message } from 'antd';
import { UploadOutlined, UserOutlined, LoadingOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import axios from 'axios';
import debounce from "lodash/debounce";

const AvatarBox = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-size: cover;
  background-position: center;
  background-color: #e6e9f0;
  transition: all 0.3s;

  &:hover {
    background-color: #d9dfe6;
  }
`;

const Placeholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
`;

const UploadButton = styled(Button)`
  margin-top: 10px;
`;

const HiddenInput = styled.input`
  display: none !important;
`;

const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AccountInfo = React.memo(({ setAvatarImage, avatarImage, form, onAvatarUpload }) => {
  const [roleGroups, setRoleGroups] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const avatarInputRef = useRef(null);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await axios.get('/api/Role');
      const roles = response.data.map((role) => role.name);
      setRoleGroups(roles);
    } catch (err) {
      console.error('Error fetching roles:', err);
      message.error('Không thể tải danh sách nhóm quyền.');
    }
  }, []);

  const fetchAccountDefault = useCallback(async (employeeCode) => {
    if (!employeeCode) return;
    try {
      const response = await axios.get(`/api/Employee/GetAccountDefault?employeeCode=${employeeCode}`);
      const { username, password } = response.data;
      form.setFieldsValue({
        username: username || '',
        password: password || '',
      });
    } catch (err) {
      console.error('Error fetching account default:', err);
      message.error('Không thể tải thông tin tài khoản mặc định.');
      form.setFieldsValue({
        username: '',
        password: '',
      });
    }
  }, [form]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const selectedEmployee = Form.useWatch('fullName', form);

  const debouncedFetchAccountDefault = useMemo(() => debounce((employeeCode) => {
    if (employeeCode) {
      fetchAccountDefault(employeeCode);
    } else {
      form.setFieldsValue({
        username: '',
        password: '',
      });
    }
  }, 300), [fetchAccountDefault, form]);

  useEffect(() => {
    if (selectedEmployee && typeof selectedEmployee === 'string') {
      const employeeCode = selectedEmployee.split(' - ')[0];
      debouncedFetchAccountDefault(employeeCode);
    } else {
      debouncedFetchAccountDefault(null);
    }

    return () => {
      debouncedFetchAccountDefault.cancel();
    };
  }, [selectedEmployee, debouncedFetchAccountDefault]);

  const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadLoading(true);
      
      // Create a new axios instance without the global interceptor for this upload
      const uploadAxios = axios.create({
        baseURL: axios.defaults.baseURL,
      });
      
      // Add only the auth header for upload
      const token = localStorage.getItem("accessToken");
      const uploadConfig = {
        headers: {}
      };
      
      if (token) {
        uploadConfig.headers.Authorization = `Bearer ${token}`;
      }
      
      // Don't set Content-Type, let browser set it with boundary for multipart/form-data
      
      const response = await uploadAxios.post('/api/FileUpload/UploadFile', formData, uploadConfig);

      if (response.status === 200) {
        const { id, filePath } = response.data;
        
        // Callback to parent component with avatar ID
        if (onAvatarUpload) {
          onAvatarUpload(id);
        }
        
        return { id, filePath };
      }
    } catch (error) {
      console.error('Upload avatar error:', error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Upload avatar thất bại!');
      }
      throw error;
    } finally {
      setUploadLoading(false);
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      if (!allowedExtensions.includes(fileExtension)) {
        message.error('Chỉ cho phép tải lên file ảnh (jpg, jpeg, png, gif)!');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        message.error('Kích thước file phải nhỏ hơn 5MB!');
        return;
      }

      try {
        // Show preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarImage(reader.result);
        };
        reader.onerror = (error) => {
          console.error('FileReader error:', error);
          message.error('Không thể đọc file!');
        };
        reader.readAsDataURL(file);

        // Upload to server
        await uploadAvatar(file);
      } catch (error) {
        // If upload fails, remove preview
        setAvatarImage(null);
      }
    }
  };

  const roleOptions = useMemo(() => roleGroups.map((role, index) => (
    <Select.Option key={index} value={role}>
      {role}
    </Select.Option>
  )), [roleGroups]);

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <div>
            <div style={{ marginBottom: '8px' }}>Avatar</div>
            <AvatarContainer>
              <AvatarBox
                onClick={() => !uploadLoading && avatarInputRef.current.click()}
                style={{ 
                  backgroundImage: avatarImage ? `url(${avatarImage})` : 'none',
                  cursor: uploadLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {!avatarImage && !uploadLoading && (
                  <Placeholder>
                    <UserOutlined style={{ fontSize: '120px', color: '#fff' }} />
                  </Placeholder>
                )}
                {uploadLoading && (
                  <Placeholder>
                    <LoadingOutlined style={{ fontSize: '40px', color: '#1890ff' }} />
                    <div style={{ marginTop: '10px', color: '#1890ff' }}>Đang tải...</div>
                  </Placeholder>
                )}
              </AvatarBox>

              <HiddenInput
                type="file"
                accept="image/*"
                ref={avatarInputRef}
                onChange={handleImageChange}
                disabled={uploadLoading}
              />

              <UploadButton
                icon={uploadLoading ? <LoadingOutlined /> : <UploadOutlined />}
                onClick={() => !uploadLoading && avatarInputRef.current.click()}
                loading={uploadLoading}
                disabled={uploadLoading}
              >
                {uploadLoading ? 'Đang tải...' : 'Avatar'}
              </UploadButton>
            </AvatarContainer>
          </div>
        </Col>

        <Col xs={24} sm={6}>
          <Form.Item 
            label="Tên đăng nhập" 
            name="username" 
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
          >
            <Input disabled />
          </Form.Item>
        </Col>

        <Col xs={24} sm={6}>
          <Form.Item 
            label="Mật khẩu (*)" 
            name="password" 
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu ban đầu' }]}
          >
            <Input.Password />
          </Form.Item>
        </Col>

        <Col xs={24} sm={6}>
          <Form.Item
            label="Nhóm quyền"
            name="roleGroup"
            rules={[{ required: true, message: 'Vui lòng chọn nhóm quyền!' }]}
          >
            <Select placeholder="Chọn nhóm quyền">
              {roleOptions}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </>
  );
});

export default AccountInfo;