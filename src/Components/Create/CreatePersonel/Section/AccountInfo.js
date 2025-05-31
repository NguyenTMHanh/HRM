import React, { useEffect, useRef } from 'react';
import { Form, Input, Select, Row, Col, Button, message } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import axios from 'axios'; // Import axios

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

const AccountInfo = ({ setAvatarImage, avatarImage }) => {
  const [roleGroups, setRoleGroups] = React.useState([]);
  const avatarInputRef = useRef(null);

  // Fetch roles from API
  const fetchRoles = async () => {
    try {
      const response = await axios.get('/api/Role');
      // Map the response to extract the 'name' field for the combobox
      const roles = response.data.map((role) => role.name);
      setRoleGroups(roles);
    } catch (err) {
      console.error('Error fetching roles:', err);
      message.error('Không thể tải danh sách nhóm quyền.');
    }
  };

  useEffect(() => {
    fetchRoles(); // Fetch roles when the component mounts
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setAvatarImage(result);
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <div>
            <div style={{ marginBottom: '8px' }}>Avatar</div>
            <AvatarContainer>
              <AvatarBox
                onClick={() => avatarInputRef.current.click()}
                style={{ backgroundImage: avatarImage ? `url(${avatarImage})` : 'none' }}
              >
                {!avatarImage && (
                  <Placeholder>
                    <UserOutlined style={{ fontSize: '120px', color: '#fff' }} />
                  </Placeholder>
                )}
              </AvatarBox>

              <HiddenInput
                type="file"
                accept="image/*"
                ref={avatarInputRef}
                onChange={handleImageChange}
              />

              <UploadButton
                icon={<UploadOutlined />}
                onClick={() => avatarInputRef.current.click()}
              >
                Avatar
              </UploadButton>
            </AvatarContainer>
          </div>
        </Col>

        <Col xs={24} sm={6}>
          <Form.Item label="Tên đăng nhập" name="username">
            <Input disabled />
          </Form.Item>
        </Col>

        <Col xs={24} sm={6}>
          <Form.Item label="Mật khẩu (*)" name="password">
            <Input.Password disabled />
          </Form.Item>
        </Col>

        <Col xs={24} sm={6}>
          <Form.Item
            label="Nhóm quyền"
            name="roleGroup"
            rules={[{ required: true, message: 'Vui lòng chọn nhóm quyền!' }]}
          >
            <Select placeholder="Chọn nhóm quyền">
              {roleGroups.map((role, index) => (
                <Select.Option key={index} value={role}>
                  {role}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default AccountInfo;