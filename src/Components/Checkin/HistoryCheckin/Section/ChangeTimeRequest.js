import React, { useState } from 'react';
import './styles.css';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const ChangeTimeRequest = ({ requests }) => {
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <div className="change-time-request">
      <div className="request-table">
        <div className="table-header">
          <span>Ngày</span>
          <span>Trạng thái</span>
          <span>Hành động</span>
        </div>
        {requests.map((request, index) => (
          <div key={index} className="table-row">
            <div className="row-content">
              <span>{request.date}</span>
              <span className={`status ${request.status.toLowerCase()}`}>
                {request.status}
              </span>
              <span className="action">
                <button onClick={() => toggleRow(index)}>
                  {expandedRow === index ? <FaChevronUp /> : <FaChevronDown />}
                </button>
              </span>
            </div>
            {expandedRow === index && (
              <div className="row-details">
                <div className="detail-item">
                  <span className="detail-label">Check in-out</span>
                  <span className="detail-value">
                    {request.details.workingTime.old} → {request.details.workingTime.new}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Giờ làm</span>
                  <span className="detail-value">
                    {request.details.workingHours.old} → {request.details.workingHours.new}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Nghỉ trưa</span>
                  <span className="detail-value">
                    {request.details.lunchBreak.old} → {request.details.lunchBreak.new}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Hình thức làm việc</span>
                  <span className="detail-value">
                    {request.details.workingType.old} → {request.details.workingType.new}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Loại ngày công</span>
                  <span className="detail-value">
                    {request.details.checkFlag.old} → {request.details.checkFlag.new}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Lý do</span>
                  <span className="detail-value">{request.details.description}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChangeTimeRequest;