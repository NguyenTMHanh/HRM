import React from 'react';
import { Modal } from 'antd';
import FooterBar from '../../../Footer/Footer';
import './styles.css';

const ConfirmDlg = ({ open, onCancel }) => {
  const handleConfirm = () => {
    console.log("Xác nhận bảng lương");
    onCancel(); // Close the dialog after confirmation
  };

  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  const formattedDate = `${month}/${year}`;

  return (
    <Modal
      title={`Xác nhận lương tháng ${formattedDate}`}
      open={open}
      onCancel={onCancel}
      centered={true}
      footer={
        <FooterBar
          onConfirm={handleConfirm}
          onCancel={onCancel}
          showConfirm={true}
          showCancel={true}
          isModalFooter={true} 
        />
      }
      className="confirm-dlg"
    >
      <div className="confirm-content">
        <p>Vui lòng xác nhận để công ty tiến hành thanh toán lương tháng này cho bạn</p>
      </div>
    </Modal>
  );
};

export default ConfirmDlg;