import React, { useEffect, useRef } from 'react';
import { Form, Input, Select, Row, Col, Button } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';

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

  useEffect(() => {
    setRoleGroups(['Nhân viên', 'Trưởng phòng ban', 'Quản lý cấp cao']);
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setAvatarImage(result);
        // Nếu muốn set vào form: form.setFieldsValue({ avatar: result });
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

              {/* Đã xóa Form.Item gây cảnh báo */}
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
            <Select>
              {roleGroups.map((role) => (
                <Select.Option key={role} value={role}>
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
