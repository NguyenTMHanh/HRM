import React, { useState } from 'react';
import './styles.css';
import { FaTrash, FaUpload } from 'react-icons/fa';

const ChangeCheckinDlg = ({ isOpen, onClose, onSubmit, initialData }) => {
  // Log để kiểm tra initialData
  console.log('initialData:', initialData);

  // Khởi tạo formData với xử lý dữ liệu an toàn hơn
  const [formData, setFormData] = useState({
    date: initialData?.date || 'Không xác định',
    checkIn: initialData?.checkInOut && typeof initialData.checkInOut === 'string' && initialData.checkInOut.includes(' – ')
      ? initialData.checkInOut.split(' – ')[0] || ''
      : '',
    checkOut: initialData?.checkInOut && typeof initialData.checkInOut === 'string' && initialData.checkInOut.includes(' – ')
      ? initialData.checkInOut.split(' – ')[1] || ''
      : '',
    lunchBreak: initialData?.lunchBreak && typeof initialData.lunchBreak === 'string'
      ? initialData.lunchBreak.replace(' hrs', '') || ''
      : '',
    workingType: initialData?.type || 'Office',
    checkFlag: initialData?.checkFlag || 'WorkDay',
    reason: initialData?.reason || '',
    evidence: initialData?.evidence || [],
  });

  const [files, setFiles] = useState(initialData?.evidence || []);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (files.length + newFiles.length <= 3) {
      setFiles((prev) => [...prev, ...newFiles]);
    } else {
      alert('You can upload a maximum of 3 files.');
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const updatedData = {
      date: formData.date,
      checkInOut: `${formData.checkIn} – ${formData.checkOut}`,
      lunchBreak: `${formData.lunchBreak} hrs`,
      type: formData.workingType,
      checkFlag: formData.checkFlag,
      reason: formData.reason,
      evidence: files,
    };
    onSubmit(updatedData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Thay đổi Check in-out</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-row">
            <div className="modal-column">
              <label>Ngày</label>
              <select name="date" value={formData.date} onChange={handleChange} disabled>
                <option value={formData.date}>{formData.date}</option>
              </select>
            </div>
            <div className="modal-column">
              <label>Check in-out</label>
              <div className="time-inputs">
                <input
                  type="time"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleChange}
                />
                <span>–</span>
                <input
                  type="time"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="modal-column">
              <label>Nghỉ trưa</label>
              <div className="lunch-break-input">
                <input
                  type="number"
                  name="lunchBreak"
                  value={formData.lunchBreak}
                  onChange={handleChange}
                  step="0.5"
                  min="0"
                />
                <span>hrs</span>
              </div>
            </div>
            <div className="modal-column">
              <label>Hình thức làm việc</label>
              <select name="workingType" value={formData.workingType} onChange={handleChange}>
                <option value="Office">Office</option>
                <option value="WFH">WFH</option>
              </select>
            </div>
            <div className="modal-column">
              <label>Loại ngày công</label>
              <select name="checkFlag" value={formData.checkFlag} onChange={handleChange}>
                <option value="WorkDay">WorkDay</option>
                <option value="Holiday">Holiday</option>
              </select>
            </div>
            <div className="modal-column">
              <label>Lý do</label>
              <input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Enter reason"
              />
            </div>
            <div className="modal-column">
              <label>Minh chứng</label>
              <div className="evidence-upload">
                <label className="upload-button">
                  <FaUpload /> (max: 3)
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </label>
                <div className="file-list">
                  {files.map((file, index) => (
                    <div key={index} className="file-item">
                      <span>{file.name}</span>
                      <FaTrash onClick={() => removeFile(index)} className="remove-file" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeCheckinDlg;