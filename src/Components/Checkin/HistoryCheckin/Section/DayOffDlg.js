import React, { useState } from 'react';
import { Modal, Select, Input, DatePicker, Space } from 'antd';
import FooterBar from '../../../Footer/Footer';
import './styles.css';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const AbsenceRequestDlg = ({ open, onCancel, absenceType = 'DAY-OFF' }) => {
  const [formData, setFormData] = useState({
    type: absenceType,
    reason: '',
    dateRange: null
  });

  const handleSubmit = () => {
    console.log("Gửi đơn xin phép:", formData);
    // Reset form
    setFormData({
      type: absenceType,
      reason: '',
      dateRange: null
    });
    onCancel();
  };

  const handleCancel = () => {
    // Reset form when cancel
    setFormData({
      type: absenceType,
      reason: '',
      dateRange: null
    });
    onCancel();
  };

  const handleTypeChange = (value) => {
    setFormData(prev => ({
      ...prev,
      type: value
    }));
  };

  const handleReasonChange = (e) => {
    setFormData(prev => ({
      ...prev,
      reason: e.target.value
    }));
  };

  const handleDateRangeChange = (dates) => {
    setFormData(prev => ({
      ...prev,
      dateRange: dates
    }));
  };

  return (
    <Modal
      title="Đơn xin phép nghỉ"
      open={open}
      onCancel={handleCancel}
      centered={true}
      width={500}
      footer={
        <FooterBar
          onConfirm={handleSubmit}
          onCancel={handleCancel}
          showConfirm={true}
          showCancel={true}
          isModalFooter={true}
          confirmText="Gửi"
          cancelText="Hủy"
        />
      }
      className="absence-request-dlg"
    >
      <div className="absence-request-content">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Kiểu nghỉ */}
          <div className="form-item">
            <label className="form-label">Kiểu nghỉ:</label>
            <Select
              value={formData.type}
              onChange={handleTypeChange}
              style={{ width: '100%' }}
              options={[
                { value: 'AM-OFF', label: 'Nghỉ buổi sáng (AM-OFF)' },
                { value: 'PM-OFF', label: 'Nghỉ buổi chiều (PM-OFF)' },
                { value: 'DAY-OFF', label: 'Nghỉ cả ngày (DAY-OFF)' }
              ]}
            />
          </div>

          {/* Lý do */}
          <div className="form-item">
            <label className="form-label">Lý do:</label>
            <TextArea
              value={formData.reason}
              onChange={handleReasonChange}
              placeholder="Nhập lý do xin phép nghỉ..."
              rows={3}
              maxLength={500}
              showCount
            />
          </div>

          {/* Từ ngày - Đến ngày */}
          <div className="form-item">
            <label className="form-label">Thời gian:</label>
            <RangePicker
              value={formData.dateRange}
              onChange={handleDateRangeChange}
              style={{ width: '100%' }}
              placeholder={['Từ ngày', 'Đến ngày']}
              format="DD/MM/YYYY"
            />
          </div>
        </Space>
      </div>
    </Modal>
  );
};

export default AbsenceRequestDlg;