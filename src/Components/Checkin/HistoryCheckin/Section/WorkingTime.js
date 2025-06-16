import React, { useState } from 'react';
import './styles.css';
import { MdWork, MdLaptopMac, MdAccessTime, MdTimelapse, MdBeachAccess, MdEvent, MdCelebration } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import moment from 'moment';
import ChangeCheckinDlg from './ChangeCheckinDlg';

const WorkStats = ({
  totalWorkingDays,
  totalWFHDays,
  totalWorkingHours,
  averageWorkingHours,
  totalDaysOff,
  totalWeekendOT,
  totalHolidayOT,
  checkinData,
  selectedMonth,
  selectedYear,
  onEdit,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const daysInMonth = moment(`${selectedYear}-${selectedMonth}`, 'YYYY-MM').daysInMonth();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
    const day = (i + 1).toString().padStart(2, '0');
    const date = moment(`${selectedYear}-${selectedMonth}-${day}`, 'YYYY-MM-DD');
    const dayOfWeek = date.format('ddd').toUpperCase();
    const formattedDate = `${day} – ${dayOfWeek}`;

    const checkinEntry = checkinData.find((entry) => entry.date === formattedDate);

    if (checkinEntry) {
      return {
        ...checkinEntry,
        date: checkinEntry.date || formattedDate, // Đảm bảo date luôn tồn tại
      };
    }

    return {
      date: formattedDate,
      checkInOut: '',
      lunchBreak: '',
      hours: '',
      type: '',
      checkFlag: '',
    };
  });

  const handleEditClick = (row) => {
    console.log('Row being edited:', row); // Kiểm tra dữ liệu của row
    setSelectedRow(row);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedRow(null);
  };

  const handleDialogSubmit = (updatedData) => {
    onEdit(updatedData);
  };

  return (
    <div className="work-stats-wrapper">
      <div className="work-stats-container">
        <div className="stat-box">
          <p>
            <MdWork className="stat-icon working-days-icon" /> Ngày làm việc
          </p>
          <h3>{totalWorkingDays} ngày</h3>
        </div>
        <div className="stat-box">
          <p>
            <MdAccessTime className="stat-icon working-hours-icon" /> Giờ làm việc
          </p>
          <h3>{totalWorkingHours} giờ</h3>
        </div>
        <div className="stat-box">
          <p>
            <MdTimelapse className="stat-icon avg-hours-icon" /> Giờ làm trung bình
          </p>
          <h3>{averageWorkingHours} giờ</h3>
        </div>
        <div className="stat-box">
          <p>
            <MdBeachAccess className="stat-icon days-off-icon" /> Ngày nghỉ
          </p>
          <h3>{totalDaysOff} ngày</h3>
        </div>
      </div>

      <div className="checkin-table-container">
        <table className="checkin-table">
          <thead>
            <tr>
              <th>Ngày</th>
              <th>Check in – out</th>
              <th>Nghỉ trưa</th>
              <th>Giờ làm</th>
              <th>Hình thức làm việc</th>
              <th>Loại ngày công</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {daysArray.map((row, index) => (
              <tr
                key={index}
                className={
                  row.date.includes('SAT') || row.date.includes('SUN')
                    ? 'weekend-row'
                    : row.checkFlag === 'Holiday:'
                    ? 'holiday-row'
                    : 'workday-row'
                }
              >
                <td>{row.date}</td>
                <td>{row.checkInOut}</td>
                <td>{row.lunchBreak}</td>
                <td>{row.hours}</td>
                <td>{row.type}</td>
                <td>{row.checkFlag}</td>
                <td>
                  {row.checkInOut && (
                    <button
                      className="edit-button"
                      onClick={() => handleEditClick(row)}
                      title="Chỉnh sửa"
                    >
                      <FaEdit />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ChangeCheckinDlg
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        initialData={selectedRow}
      />
    </div>
  );
};

export default WorkStats;