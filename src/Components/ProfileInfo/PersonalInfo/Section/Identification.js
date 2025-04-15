import React from 'react';
import { Row, Col, Typography } from 'antd';
import styled from 'styled-components';

const { Title } = Typography;

const ImageBox = styled.div`
  width: 400px;
  height: 260px;
  border-radius: 10px;
  background-size: cover;
  background-position: center;
  margin: 0 auto;
`;

const TextCenter = styled.div`
  text-align: center;
  margin-bottom: 10px;
`;

const IdentificationDisplay = ({ frontImage, backImage }) => {
  return (
    <Row gutter={[16, 32]} justify="center" style={{ marginBottom: 26, marginTop: 20 }}>
      <Col xs={24} sm={12} >
        <TextCenter>
          <Title level={5}>Ảnh CCCD/CMND mặt trước</Title>
        </TextCenter>
        {frontImage ? (
          <ImageBox style={{ backgroundImage: `url(${frontImage})` }} />
        ) : (
          <TextCenter>Không có ảnh mặt trước</TextCenter>
        )}
      </Col>

      <Col xs={24} sm={12}>
        <TextCenter>
          <Title level={5}>Ảnh CCCD/CMND mặt sau</Title>
        </TextCenter>
        {backImage ? (
          <ImageBox style={{ backgroundImage: `url(${backImage})` }} />
        ) : (
          <TextCenter>Không có ảnh mặt sau</TextCenter>
        )}
      </Col>
    </Row>
  );
};

export default IdentificationDisplay;
