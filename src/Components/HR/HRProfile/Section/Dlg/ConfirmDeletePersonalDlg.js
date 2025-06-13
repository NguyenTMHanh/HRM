import React from 'react';
import { Modal } from 'antd';
import FooterBar from '../../../../Footer/Footer';
import './styles.css';

const ConfirmDlg = ({ open, onCancel, onConfirm, employeeCode }) => {
  const handleConfirm = () => {
    console.log("Xác nhận xóa nhân sự");
    onConfirm();
    onCancel();
  };

  return (
    <Modal
      title="Xác nhận xóa nhân sự"
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
        <p>Bạn có chắc chắn muốn xóa thông tin cá nhân của nhân sự {employeeCode} này không?</p>
      </div>
    </Modal>
  );
};

export default ConfirmDlg;