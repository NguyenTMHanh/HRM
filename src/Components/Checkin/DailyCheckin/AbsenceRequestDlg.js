import React, { useState } from 'react';
import { Modal, Select, Input, DatePicker, Space } from 'antd';
import FooterBar from '../../Footer/Footer';
import './style.css';

const { TextArea } = Input;

const AbsenceRequestDlg = ({ open, onCancel, absenceType = 'DAY-OFF' }) => {
  const [formData, setFormData] = useState({
    type: absenceType,
    reason: '',
    fromDate: null,
    toDate: null
  });

  const handleSubmit = () => {
    console.log("Gửi đơn xin phép:", formData);
    // Reset form
    setFormData({
      type: absenceType,
      reason: '',
      fromDate: null,
      toDate: null
    });
    onCancel();
  };

  const handleCancel = () => {
    // Reset form when cancel
    setFormData({
      type: absenceType,
      reason: '',
      fromDate: null,
      toDate: null
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

  const handleFromDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      fromDate: date
    }));
  };

  const handleToDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      toDate: date
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
          onSend={handleSubmit}
          onCancel={handleCancel}
          showSend={true}
          showCancel={true}
          isModalFooter={true}
          confirmText="Gửi"
          cancelText="Hủy"
        />
      }
      className="confirm-dlg"
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
            <div className="date-range-row">
              <div className="date-input-group">
                <label className="form-label">Từ ngày:</label>
                <DatePicker
                  value={formData.fromDate}
                  onChange={handleFromDateChange}
                  style={{ width: '100%' }}
                  placeholder="Chọn ngày bắt đầu"
                  format="DD/MM/YYYY"
                />
              </div>
              <div className="date-input-group">
                <label className="form-label">Đến ngày:</label>
                <DatePicker
                  value={formData.toDate}
                  onChange={handleToDateChange}
                  style={{ width: '100%' }}
                  placeholder="Chọn ngày kết thúc"
                  format="DD/MM/YYYY"
                  disabledDate={(current) => {
                    // Disable dates before fromDate
                    return formData.fromDate && current && current < formData.fromDate.startOf('day');
                  }}
                />
              </div>
            </div>
          </div>
        </Space>
      </div>
    </Modal>
  );
};

export default AbsenceRequestDlg;