import React from 'react';
import { Layout, Button, Space } from 'antd';
import './styles.css';

const { Footer } = Layout;

function FooterBar({ onSave, onCancel, onNext, onBack, showNext, showBack }) {
  return (
    <Footer className="footer-bar">
      <Space>
        <Button
          className="footer-btn cancel-btn"
          onClick={onCancel}
        >
          Hủy bỏ
        </Button>
        {showBack && (
          <Button
            className="footer-btn primary-btn"
            onClick={onBack}
            type="primary"
          >
            Quay lại
          </Button>
        )}
        <Button
          className="footer-btn primary-btn"
          type="primary"
          onClick={onSave}
        >
          Lưu
        </Button>
        {showNext && (
          <Button
            className="footer-btn primary-btn"
            type="primary"
            onClick={onNext}
          >
            Tiếp tục
          </Button>
        )}
      </Space>
    </Footer>
  );
}

export default FooterBar;
