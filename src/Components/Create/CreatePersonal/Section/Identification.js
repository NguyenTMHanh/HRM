import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { UserOutlined, CameraOutlined, LoadingOutlined } from '@ant-design/icons';
import { Form, Row, Col, message } from 'antd';
import axios from 'axios';

const UploadBox = styled.div`
  position: relative;
  width: 400px;
  height: 260px;
  border: 2px dashed #ccc;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-size: cover;
  background-position: center;
  background-color: #e6f0fa;
  text-align: center;
  color: #666;
  font-size: 1rem;
  transition: all 0.3s;

  &:hover {
    border-color: #1890ff;
    color: #1890ff;
  }
`;

const Placeholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Icon = styled.div`
  margin-bottom: 10px;
`;

const Bar = styled.div`
  height: 10px;
  background-color: #ccc;
  margin: 5px 0;
`;

const Text = styled.div`
  margin-top: 10px;
  font-size: 1rem;
  color: #666;
`;

const CameraButton = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background-color: #1890ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HiddenInput = styled.input`
  display: none !important;
`;

const Identification = ({ setFrontImage, setBackImage, frontImage, backImage, onImageUpload }) => {
  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);
  const [frontLoading, setFrontLoading] = useState(false);
  const [backLoading, setBackLoading] = useState(false);

  const uploadImage = async (file, type) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const setLoading = type === 'front' ? setFrontLoading : setBackLoading;
      setLoading(true);

      // Create a new axios instance without the global interceptor for this upload
      const uploadAxios = axios.create({
        baseURL: axios.defaults.baseURL,
      });

      // Add only the auth header for upload
      const token = localStorage.getItem('accessToken');
      const uploadConfig = {
        headers: {},
      };

      if (token) {
        uploadConfig.headers.Authorization = `Bearer ${token}`;
      }

      const response = await uploadAxios.post('/api/FileUpload/UploadFile', formData, uploadConfig);

      if (response.status === 200) {
        const { id, filePath } = response.data;

        // Callback to parent component with image ID and type
        if (onImageUpload) {
          onImageUpload(id, type);
        }

        return { id, filePath };
      }
    } catch (error) {
      console.error(`Upload ${type} image error:`, error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error(`Upload ảnh ${type === 'front' ? 'mặt trước' : 'mặt sau'} thất bại!`);
      }
      throw error;
    } finally {
      const setLoading = type === 'front' ? setFrontLoading : setBackLoading;
      setLoading(false);
    }
  };

  const handleImageChange = async (event, setImage, type) => {
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
          setImage(reader.result);
        };
        reader.onerror = (error) => {
          console.error('FileReader error:', error);
          message.error('Không thể đọc file!');
        };
        reader.readAsDataURL(file);

        // Upload to server
        await uploadImage(file, type);
      } catch (error) {
        // If upload fails, remove preview
        setImage(null);
      }
    }
  };

  return (
    <Row gutter={[16, 16]} justify="center">
      <Col xs={24} sm={12} style={{ textAlign: 'center' }}>
        <Form.Item
          label="Ảnh CCCD/CMND mặt trước"
          name="frontImage"
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn ảnh mặt trước!',
              validator: (_, value) => {
                if (frontImage) {
                  return Promise.resolve();
                }
                return Promise.reject('Vui lòng chọn ảnh mặt trước!');
              },
            },
          ]}
        >
          <UploadBox
            onClick={() => !frontLoading && frontInputRef.current.click()}
            style={{
              backgroundImage: frontImage ? `url(${frontImage})` : 'none',
              cursor: frontLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {!frontImage && !frontLoading ? (
              <>
                <Placeholder>
                  <Icon>
                    <UserOutlined style={{ fontSize: '80px', color: '#ccc' }} />
                  </Icon>
                  <Bar style={{ width: '60%' }} />
                  <Bar style={{ width: '40%' }} />
                  <Text>Chụp/Chọn ảnh mặt trước</Text>
                </Placeholder>
                <CameraButton>
                  <CameraOutlined style={{ color: 'white', fontSize: '20px' }} />
                </CameraButton>
              </>
            ) : frontLoading ? (
              <Placeholder>
                <LoadingOutlined style={{ fontSize: '40px', color: '#1890ff' }} />
                <Text style={{ color: '#1890ff' }}>Đang tải...</Text>
              </Placeholder>
            ) : null}
          </UploadBox>
        </Form.Item>
        <HiddenInput
          type="file"
          accept="image/*"
          ref={frontInputRef}
          onChange={(e) => handleImageChange(e, setFrontImage, 'front')}
          disabled={frontLoading}
        />
      </Col>

      <Col xs={24} sm={12} style={{ textAlign: 'center' }}>
        <Form.Item
          label="Ảnh CCCD/CMND mặt sau"
          name="backImage"
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn ảnh mặt sau!',
              validator: (_, value) => {
                if (backImage) {
                  return Promise.resolve();
                }
                return Promise.reject('Vui lòng chọn ảnh mặt sau!');
              },
            },
          ]}
        >
          <UploadBox
            onClick={() => !backLoading && backInputRef.current.click()}
            style={{
              backgroundImage: backImage ? `url(${backImage})` : 'none',
              cursor: backLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {!backImage && !backLoading ? (
              <>
                <Placeholder>
                  <Icon>
                    <UserOutlined style={{ fontSize: '80px', color: '#ccc' }} />
                  </Icon>
                  <Bar style={{ width: '60%' }} />
                  <Bar style={{ width: '40%' }} />
                  <Text>Chụp/Chọn ảnh mặt sau</Text>
                </Placeholder>
                <CameraButton>
                  <CameraOutlined style={{ color: 'white', fontSize: '20px' }} />
                </CameraButton>
              </>
            ) : backLoading ? (
              <Placeholder>
                <LoadingOutlined style={{ fontSize: '40px', color: '#1890ff' }} />
                <Text style={{ color: '#1890ff' }}>Đang tải...</Text>
              </Placeholder>
            ) : null}
          </UploadBox>
        </Form.Item>
        <HiddenInput
          type="file"
          accept="image/*"
          ref={backInputRef}
          onChange={(e) => handleImageChange(e, setBackImage, 'back')}
          disabled={backLoading}
        />
      </Col>
    </Row>
  );
};

export default Identification;