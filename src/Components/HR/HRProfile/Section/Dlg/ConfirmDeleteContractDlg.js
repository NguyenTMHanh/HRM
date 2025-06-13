import React from 'react';
import { Modal } from 'antd';
import FooterBar from '../../../../Footer/Footer';
import './styles.css';

const ConfirmDlg = ({ open, onCancel, onConfirm, employeeCode, contractId }) => {
  const handleConfirm = () => {
    console.log("Xác nhận xóa hợp đồng lao động");
    onConfirm();
    onCancel();
  };

  return (
    <Modal
      title="Xác nhận xóa hợp đồng lao động"
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
        <p>Bạn có chắc chắn muốn xóa hợp đồng {contractId} của nhân sự {employeeCode} này không?</p>
      </div>
    </Modal>
  );
};

export default ConfirmDlg;