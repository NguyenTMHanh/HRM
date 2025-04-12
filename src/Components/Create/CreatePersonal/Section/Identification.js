import React, {useRef } from 'react';
import styled from 'styled-components';
import { UserOutlined, CameraOutlined } from '@ant-design/icons';
import { Form, Row, Col } from 'antd';

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
  font-size: 14px;
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
  font-size: 14px;
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

const Identification = ({ setFrontImage, setBackImage, frontImage, backImage }) => {
  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);

  const handleImageChange = (event, setImage) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
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
            onClick={() => frontInputRef.current.click()}
            style={{ backgroundImage: frontImage ? `url(${frontImage})` : 'none' }}
          >
            {!frontImage ? (
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
            ) : null}
          </UploadBox>
        </Form.Item>
        <HiddenInput
          type="file"
          accept="image/*"
          ref={frontInputRef}
          onChange={(e) => handleImageChange(e, setFrontImage)}
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
            onClick={() => backInputRef.current.click()}
            style={{ backgroundImage: backImage ? `url(${backImage})` : 'none' }}
          >
            {!backImage ? (
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
            ) : null}
          </UploadBox>
        </Form.Item>
        <HiddenInput
          type="file"
          accept="image/*"
          ref={backInputRef}
          onChange={(e) => handleImageChange(e, setBackImage)}
        />
      </Col>
    </Row>
  );
};

export default Identification;