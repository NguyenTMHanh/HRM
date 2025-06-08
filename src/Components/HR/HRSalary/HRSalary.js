import React from 'react';
import moment from 'moment';
import TableComponent from '../../../Shared/Table/Table';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const HRSalary = () => {
  const navigate = useNavigate();

  // Get current year and month using moment
  const currentYear = moment().format('YYYY'); // e.g., "2025"
  const currentMonth = moment().format('MM'); // e.g., "04"

  // Generate year options (last 10 years)
  const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString());
  
  // Month options (01 to 12)
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  const salaryData = [
    {
      employeeId: 'HR001',
      avatar: '/avatar.jpg',
      fullName: 'Nguyễn Văn A',
      branch: 'Hà Nội',
      department: 'Nhân sự',
      position: 'Chuyên viên',
      actualSalary: 16000000,
      totalAllowances: 1100000,
      totalAllowancesBasedOnActualDays: 1000000,
      totalBonus: 2000000,
      totalPenalty: 0,
      totalIncome: 19100000,
      basicSalary: 10000000,
      totalInsuranceAllowances: 1100000,
      salaryForInsurance: 11100000,
      insuranceDeductions: 1000000,
      totalDeductions: 16100000,
      taxableIncome: 3000000,
      taxRate: 5,
      personalIncomeTax: 150000,
      advance: 5000000,
      netSalary: 14000000,
      year: '2025',
      month: '04',
    },
    {
      employeeId: 'IT002',
      avatar: '/avatar.jpg',
      fullName: 'Trần Thị B',
      branch: 'Hồ Chí Minh',
      department: 'Công nghệ thông tin',
      position: 'Kỹ sư phần mềm',
      actualSalary: 19200000,
      totalAllowances: 1250000,
      totalAllowancesBasedOnActualDays: 1193182,
      totalBonus: 2500000,
      totalPenalty: 100000,
      totalIncome: 22883182,
      basicSalary: 12000000,
      totalInsuranceAllowances: 1250000,
      salaryForInsurance: 13250000,
      insuranceDeductions: 1192500,
      totalDeductions: 16250000,
      taxableIncome: 6633182,
      taxRate: 10,
      personalIncomeTax: 663318,
      advance: 6000000,
      netSalary: 16040364,
      year: '2025',
      month: '04',
    },
    {
      employeeId: 'FIN003',
      avatar: '/avatar.jpg',
      fullName: 'Lê Văn C',
      branch: 'Đà Nẵng',
      department: 'Tài chính',
      position: 'Kế toán viên',
      actualSalary: 14400000,
      totalAllowances: 950000,
      totalAllowancesBasedOnActualDays: 950000,
      totalBonus: 1500000,
      totalPenalty: 50000,
      totalIncome: 16850000,
      basicSalary: 9000000,
      totalInsuranceAllowances: 950000,
      salaryForInsurance: 9950000,
      insuranceDeductions: 895500,
      totalDeductions: 11950000,
      taxableIncome: 4900000,
      taxRate: 5,
      personalIncomeTax: 245000,
      advance: 4000000,
      netSalary: 12709500,
      year: '2025',
      month: '04',
    },
    {
      employeeId: 'HR002',
      avatar: '/avatar.jpg',
      fullName: 'Nguyễn Văn A',
      branch: 'Hà Nội',
      department: 'Nhân sự',
      position: 'Chuyên viên',
      actualSalary: 16000000,
      totalAllowances: 1100000,
      totalAllowancesBasedOnActualDays: 1000000,
      totalBonus: 2000000,
      totalPenalty: 0,
      totalIncome: 19100000,
      basicSalary: 10000000,
      totalInsuranceAllowances: 1100000,
      salaryForInsurance: 11100000,
      insuranceDeductions: 1000000,
      totalDeductions: 16100000,
      taxableIncome: 3000000,
      taxRate: 5,
      personalIncomeTax: 150000,
      advance: 5000000,
      netSalary: 14000000,
      year: '2024',
      month: '12',
    },
    {
      employeeId: 'IT003',
      avatar: '/avatar.jpg',
      fullName: 'Trần Thị B',
      branch: 'Hồ Chí Minh',
      department: 'Công nghệ thông tin',
      position: 'Kỹ sư phần mềm',
      actualSalary: 19200000,
      totalAllowances: 1250000,
      totalAllowancesBasedOnActualDays: 1193182,
      totalBonus: 2500000,
      totalPenalty: 100000,
      totalIncome: 22883182,
      basicSalary: 12000000,
      totalInsuranceAllowances: 1250000,
      salaryForInsurance: 13250000,
      insuranceDeductions: 1192500,
      totalDeductions: 16250000,
      taxableIncome: 6633182,
      taxRate: 10,
      personalIncomeTax: 663318,
      advance: 6000000,
      netSalary: 16040364,
      year: '2024',
      month: '12',
    },
    {
      employeeId: 'FIN004',
      avatar: '/avatar.jpg',
      fullName: 'Lê Văn C',
      branch: 'Đà Nẵng',
      department: 'Tài chính',
      position: 'Kế toán viên',
      actualSalary: 14400000,
      totalAllowances: 950000,
      totalAllowancesBasedOnActualDays: 950000,
      totalBonus: 1500000,
      totalPenalty: 50000,
      totalIncome: 16850000,
      basicSalary: 9000000,
      totalInsuranceAllowances: 950000,
      salaryForInsurance: 9950000,
      insuranceDeductions: 895500,
      totalDeductions: 11950000,
      taxableIncome: 4900000,
      taxRate: 5,
      personalIncomeTax: 245000,
      advance: 4000000,
      netSalary: 12709500,
      year: '2024',
      month: '12',
    },
  ].map((item, index) => ({
    ...item,
    stt: index + 1,
  }));

  const columns = [
    { label: 'STT', key: 'stt' },
    {
      label: 'Mã nhân sự',
      key: 'avatar',
      render: (value, item) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={value}
            alt={`${item.fullName}'s avatar`}
            style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <span>{item.employeeId}</span>
        </div>
      ),
    },
    { label: 'Họ và tên NLĐ', key: 'fullName' },
    { label: 'Chi nhánh', key: 'branch' },
    { label: 'Bộ phận', key: 'department' },
    { label: 'Vị trí', key: 'position' },
    { label: 'Lương thực tế', key: 'actualSalary' },
    { label: 'Tổng phụ cấp', key: 'totalAllowances' },
    { label: 'Tổng phụ cấp thực nhận', key: 'totalAllowancesBasedOnActualDays' },
    { label: 'Tổng thưởng', key: 'totalBonus' },
    { label: 'Tổng phạt', key: 'totalPenalty' },
    { label: 'Tổng thu nhập', key: 'totalIncome' },
    { label: 'Lương cơ bản', key: 'basicSalary' },
    { label: 'Tổng phụ cấp đóng BH', key: 'totalInsuranceAllowances' },
    { label: 'Lương đóng BH', key: 'salaryForInsurance' },
    { label: 'Trích BH trừ vào lương', key: 'insuranceDeductions' },
    { label: 'Tổng các khoản giảm trừ', key: 'totalDeductions' },
    { label: 'Thu nhập tính thuế', key: 'taxableIncome' },
    { label: 'Thuế suất', key: 'taxRate' },
    { label: 'Thuế TNCN', key: 'personalIncomeTax' },
    { label: 'Tạm ứng', key: 'advance' },
    { label: 'Thực lĩnh', key: 'netSalary' },
  ];

  const columnGroups = [
    {
      label: 'Thông tin hồ sơ nhân sự',
      columns: ['stt', 'avatar', 'fullName', 'branch', 'department', 'position'],
    },
    {
      label: 'Lương thực tế',
      columns: ['actualSalary'],
    },
    {
      label: 'Thông tin phụ cấp',
      columns: ['totalAllowances', 'totalAllowancesBasedOnActualDays'],
    },
    {
      label: 'Thông tin thưởng phạt',
      columns: ['totalBonus', 'totalPenalty'],
    },
    {
      label: 'Tổng thu nhập',
      columns: ['totalIncome'],
    },
    {
      label: 'Thông tin bảo hiểm trừ vào lương',
      columns: ['basicSalary', 'totalInsuranceAllowances', 'salaryForInsurance', 'insuranceDeductions'],
    },
    {
      label: 'Thông tin thuế TNCN',
      columns: ['totalDeductions', 'taxableIncome', 'taxRate', 'personalIncomeTax'],
    },
    {
      label: 'Tạm ứng',
      columns: ['advance'],
    },
    {
      label: 'Thực lĩnh',
      columns: ['netSalary'],
    },
  ];

  const handleEdit = (item) => {
    alert(`Editing salary info of ${item.employeeId}`);
  };

  const handleDelete = (item) => {
    alert(`Deleting salary info of ${item.employeeId}`);
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
        </div>
      </div>
      <TableComponent
        data={salaryData}
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

export default HRSalary;