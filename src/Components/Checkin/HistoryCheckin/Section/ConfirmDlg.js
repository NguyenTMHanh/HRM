import React from 'react';
import { Modal, Button, Space } from 'antd';
import './styles.css';

const ConfirmDlg = ({ open, onCancel }) => {
  const handleConfirm = () => {
    console.log("Xác nhận bảng lương");
    onCancel(); 
  };

  const currentDate = new Date();
  const month = currentDate.getMonth() + 1; 
  const year = currentDate.getFullYear();
  const formattedDate = `${month}/${year}`;

  return (
    <Modal
      title={`Xác chấm công tháng ${formattedDate}`}
      open={open}
      onCancel={onCancel}
      centered={true}
      footer={
        <Space>
          <Button onClick={onCancel} className="cancel-btn">
            Hủy
          </Button>
          <Button type="primary" onClick={handleConfirm} className="confirm-btn">
            Xác nhận
          </Button>
        </Space>
      }
      className="confirm-dlg"
    >
      <div className="confirm-content">
        <p>Vui lòng xác nhận chấm công tháng để công ty thực hiện tính lương cho bạn</p>
      </div>
    </Modal>
  );
};

export default ConfirmDlg;