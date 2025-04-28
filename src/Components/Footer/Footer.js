import React from 'react';
import { Button, Space } from 'antd';
import { SaveOutlined, CloseOutlined, ArrowRightOutlined, ArrowLeftOutlined, EditOutlined, CheckOutlined, QuestionOutlined, SendOutlined, ExportOutlined } from '@ant-design/icons';
import './styles.css';

function FooterBar({
  onSave,
  onCancel,
  onNext,
  onBack,
  onEdit,
  onConfirm,
  onQuestion,
  onSend,
  onExport,
  showSave,
  showCancel,
  showNext,
  showBack,
  showEdit,
  showConfirm,
  showQuestion,
  showSend,
  showExport,
  isModalFooter = false, 
}) {
  return (
    <div className={`footer-bar ${isModalFooter ? 'modal-footer-bar' : ''}`}>
      <Space size="middle">
        {showCancel && (
          <Button
            className="footer-btn cancel-btn"
            onClick={onCancel}
            icon={<CloseOutlined />}
          >
            Hủy
          </Button>
        )}
        {showBack && (
          <Button
            className="footer-btn primary-btn"
            onClick={onBack}
            type="primary"
            icon={<ArrowLeftOutlined />}
          >
            Quay lại
          </Button>
        )}
        {showSave && (
          <Button
            className="footer-btn primary-btn"
            type="primary"
            onClick={onSave}
            icon={<SaveOutlined />}
          >
            Lưu
          </Button>
        )}
        {showEdit && (
          <Button
            className="footer-btn primary-btn"
            type="primary"
            onClick={onEdit}
            icon={<EditOutlined />}
          >
            Chỉnh sửa
          </Button>
        )}
        {showConfirm && (
          <Button
            className="footer-btn primary-btn"
            type="primary"
            onClick={onConfirm}
            icon={<CheckOutlined />}
          >
            Xác nhận
          </Button>
        )}
        {showQuestion && (
          <Button
            className="footer-btn primary-btn"
            type="primary"
            onClick={onQuestion}
            icon={<QuestionOutlined />}
          >
            Thắc mắc
          </Button>
        )}
        {showExport && (
          <Button
            className="footer-btn primary-btn"
            type="primary"
            onClick={onExport}
            icon={<ExportOutlined />}
          >
            Xuất
          </Button>
        )}
        {showNext && (
          <Button
            className="footer-btn primary-btn"
            type="primary"
            onClick={onNext}
            icon={<ArrowRightOutlined />}
          >
            Tiếp theo
          </Button>
        )}
        {showSend && (
          <Button
            className="footer-btn primary-btn"
            type="primary"
            onClick={onSend}
            icon={<SendOutlined />}
          >
            Gửi
          </Button>
        )}
      </Space>
    </div>
  );
}

export default FooterBar;