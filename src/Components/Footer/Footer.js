import React from 'react';
import { Layout, Button, Space } from 'antd';
import { SaveOutlined, CloseOutlined, ArrowRightOutlined, ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import './styles.css';

const { Footer } = Layout;

function FooterBar({ onSave, onCancel, onNext, onBack, onEdit, showSave, showCancel, showNext, showBack, showEdit }) {
  return (
    <Footer className="footer-bar">
      <Space size="middle">
        {showCancel && (
          <Button
            className="footer-btn cancel-btn"
            onClick={onCancel}
            icon={<CloseOutlined />}
          />
        )}
        {showBack && (
          <Button
            className="footer-btn primary-btn"
            onClick={onBack}
            type="primary"
            icon={<ArrowLeftOutlined />}
          />
        )}
        {showSave && (
          <Button
            className="footer-btn primary-btn"
            type="primary"
            onClick={onSave}
            icon={<SaveOutlined />}
          />
        )}
        {showEdit && (
          <Button
            className="footer-btn edit-btn"
            type="primary"
            onClick={onEdit}
            icon={<EditOutlined />}
          />
        )}
        {showNext && (
          <Button
            className="footer-btn primary-btn"
            type="primary"
            onClick={onNext}
            icon={<ArrowRightOutlined />}
          />
        )}
      </Space>
    </Footer>
  );
}

export default FooterBar;