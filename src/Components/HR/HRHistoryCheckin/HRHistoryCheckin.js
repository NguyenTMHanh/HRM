import React from 'react';
import moment from 'moment';
import TableComponent from '../../../Shared/Table/Table';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const HRHistoryCheckin = () => {
  const navigate = useNavigate();

  // Get today's date using moment
  const currentYear = moment().format('YYYY'); // e.g., "2025"
  const currentMonth = moment().format('MM'); // e.g., "04"
  const currentDay = moment().format('DD'); // e.g., "19"

  // Generate year options (last 10 years)
  const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString());
  
  // Month options (01 to 12)
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  // Day options (01 to 31)
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  const checkinData = [
    {
      employeeId: 'HR001',
      fullName: 'Nguyễn Văn A',
      branch: 'Hà Nội',
      department: 'Nhân sự',
      position: 'Chuyên viên',
      checkinTime: '08:00',
      checkoutTime: '17:00',
      lunchBreak: '12:00 - 13:00',
      workType: 'Văn phòng',
      dayType: 'WorkDay',
    },
    {
      employeeId: 'IT002',
      fullName: 'Trần Thị B',
      branch: 'Hồ Chí Minh',
      department: 'Công nghệ thông tin',
      position: 'Kỹ sư phần mềm',
      checkinTime: '09:00',
      checkoutTime: '18:00',
      lunchBreak: '12:30 - 13:30',
      workType: 'Làm việc từ xa',
      dayType: 'WorkDay',
    },
    {
      employeeId: 'FIN003',
      fullName: 'Lê Văn C',
      branch: 'Đà Nẵng',
      department: 'Tài chính',
      position: 'Kế toán viên',
      checkinTime: '08:30',
      checkoutTime: '16:30',
      lunchBreak: '12:00 - 13:00',
      workType: 'Văn phòng',
      dayType: 'AM-OFF',
    },
    {
      employeeId: 'HR002',
      fullName: 'Nguyễn Văn A',
      branch: 'Hà Nội',
      department: 'Nhân sự',
      position: 'Chuyên viên',
      checkinTime: '08:00',
      checkoutTime: '17:00',
      lunchBreak: '12:00 - 13:00',
      workType: 'Văn phòng',
      dayType: 'DAY-OFF',
    },
    {
      employeeId: 'IT003',
      fullName: 'Trần Thị B',
      branch: 'Hồ Chí Minh',
      department: 'Công nghệ thông tin',
      position: 'Kỹ sư phần mềm',
      checkinTime: '09:00',
      checkoutTime: '18:00',
      lunchBreak: '12:30 - 13:30',
      workType: 'Làm việc từ xa',
      dayType: 'PM-OFF',
    },
    {
      employeeId: 'FIN004',
      fullName: 'Lê Văn C',
      branch: 'Đà Nẵng',
      department: 'Tài chính',
      position: 'Kế toán viên',
      checkinTime: '08:30',
      checkoutTime: '16:30',
      lunchBreak: '12:00 - 13:00',
      workType: 'Văn phòng',
      dayType: 'WorkDay',
    },
  ];

  const columns = [
    { label: 'Mã nhân sự', key: 'employeeId' },
    { label: 'Họ và tên NLĐ', key: 'fullName' },
    { label: 'Chi nhánh', key: 'branch' },
    { label: 'Bộ phận', key: 'department' },
    { label: 'Vị trí', key: 'position' },
    { label: 'Giờ vào', key: 'checkinTime' },
    { label: 'Giờ ra', key: 'checkoutTime' },
    { label: 'Giờ nghỉ trưa', key: 'lunchBreak' },
    { label: 'Hình thức làm việc', key: 'workType' },
    { label: 'Loại ngày công', key: 'dayType' },
  ];

  const columnGroups = [
    {
      label: 'Thông tin hồ sơ nhân sự',
      columns: ['employeeId', 'fullName', 'branch', 'department', 'position'],
    },
    {
      label: 'Thông tin lịch sử chấm công',
      columns: ['checkinTime', 'checkoutTime', 'lunchBreak', 'workType', 'dayType'],
    },
  ];

  const handleEdit = (item) => {
    alert(`Editing check-in history of ${item.employeeId}`);
  };

  const handleDelete = (item) => {
    alert(`Deleting check-in history of ${item.employeeId}`);
  };

  const filterData = (data, searchTerm) => {
    return data.filter((item) =>
      item.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="table-content">
      <div className="filter-controls">
        <div className="year-month-filter">
          <label htmlFor="year-select">Năm: </label>
          <select id="year-select" defaultValue={currentYear}>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <label htmlFor="month-select">Tháng: </label>
          <select id="month-select" defaultValue={currentMonth}>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>

          <label htmlFor="day-select">Ngày: </label>
          <select id="day-select" defaultValue={currentDay}>
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
      </div>
      <TableComponent
        data={checkinData}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showAdd={false}
        showCreate={false}
        filterData={filterData}
        groupBy={columnGroups}
      />
    </div>
  );
};

export default HRHistoryCheckin;