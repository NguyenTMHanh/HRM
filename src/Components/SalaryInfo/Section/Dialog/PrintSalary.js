import React, { useState } from 'react';
import { Modal, Radio, Button, Space, Select } from 'antd';
import FooterBar from '../../../Footer/Footer';
import './styles.css';

const { Option } = Select;

const PrintSalary = ({ open, onCancel, onConfirm }) => {
  const [exportOption, setExportOption] = useState('pdf');
  const [selectedPaySlip, setSelectedPaySlip] = useState('Phiếu lương 1'); 

  const handleExport = () => {
    onConfirm(exportOption, selectedPaySlip);
  };

  const paySlips = ['Phiếu lương 1', 'Phiếu lương 2', 'Phiếu lương 3', 'Phiếu lương 4'];

  return (
    <Modal
      title="Xuất phiếu lương"
      open={open}
      onCancel={onCancel}
      centered={true}
      footer={
        <FooterBar
          onExport={handleExport}
          onCancel={onCancel}
          showExport={true}
          showCancel={true}
          isModalFooter={true} 
        />
      }
      className="confirm-dlg"
    >
      <div className="confirm-content">
        <p>Mức phiếu lương</p>
        <Radio.Group
          onChange={(e) => setExportOption(e.target.value)}
          value={exportOption}
          style={{ marginBottom: 16 }}
        >
          <Space direction="horizontal">
            <Radio value="pdf">Lưu dạng PDF</Radio>
            <Radio value="print">In</Radio>
          </Space>
        </Radio.Group>
        <p>
          Mức phiếu lương <span style={{ color: 'red' }}>*</span>
        </p>
        <Select
          value={selectedPaySlip}
          onChange={(value) => setSelectedPaySlip(value)}
          style={{ width: '100%' }}
          suffixIcon={<span>▼</span>} 
        >
          {paySlips.map((slip) => (
            <Option key={slip} value={slip}>
              {slip}
            </Option>
          ))}
        </Select>
      </div>
    </Modal>
  );
};

export default PrintSalary;