import React from 'react';
import { Row, Col, Typography } from 'antd';
import styled from 'styled-components';

const { Title } = Typography;

const StyledTitle = styled(Title)`
  font-size: 0.75rem !important; /* Đặt font size cho tiêu đề */
`;

const ImageBox = styled.div`
  width: 350px;
  height: 230px;
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
      <Col xs={24} sm={12}>
        <TextCenter>
          <StyledTitle level={5}>Ảnh CCCD/CMND mặt trước</StyledTitle>
        </TextCenter>
        {frontImage ? (
          <ImageBox style={{ backgroundImage: `url(${frontImage})` }} />
        ) : (
          <TextCenter>Không có ảnh mặt trước</TextCenter>
        )}
      </Col>

      <Col xs={24} sm={12}>
        <TextCenter>
          <StyledTitle level={5}>Ảnh CCCD/CMND mặt sau</StyledTitle>
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