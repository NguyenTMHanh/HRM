import React from 'react';
import TableComponent from '../../../../Shared/Table/Table';
import { useNavigate } from 'react-router-dom';

const HRContract = () => {
  const navigate = useNavigate();

  const contractData = [
    {
      contractId: 'HD001',
      name: 'Nguyen Van A',
      employeeId: 'HR001',
      branch: 'Hà Nội',
      department: 'HR',
      position: 'Manager',
      hourlyRate: 100000,
      standardHoursPerDay: 8,
      salaryCoefficient: 1.0,
      standardWorkingDays: 22,
      basicSalary: 5000000,
      contractType: 'Không xác định thời hạn',
      status: 'Còn hiệu lực',
      validFrom: '01-01-2023',
      validTo: '31-12-2025',
    },
    {
      contractId: 'HD002',
      name: 'Tran Thi B',
      employeeId: 'IT002',
      branch: 'Hồ Chí Minh',
      department: 'IT',
      position: 'Developer',
      hourlyRate: 120000,
      standardHoursPerDay: 8,
      salaryCoefficient: 1.2,
      standardWorkingDays: 22,
      basicSalary: 6000000,
      contractType: 'Xác định thời hạn',
      status: 'Hết hiệu lực',
      validFrom: '01-01-2022',
      validTo: '31-12-2023',
    },
    {
      contractId: 'HD003',
      name: 'Le Van C',
      employeeId: 'FIN003',
      branch: 'Đà Nẵng',
      department: 'Finance',
      position: 'Accountant',
      hourlyRate: 90000,
      standardHoursPerDay: 8,
      salaryCoefficient: 0.9,
      standardWorkingDays: 22,
      basicSalary: 4500000,
      contractType: 'Không xác định thời hạn',
      status: 'Còn hiệu lực',
      validFrom: '15-03-2023',
      validTo: '15-03-2026',
    },
    {
      contractId: 'HD004',
      name: 'Pham Thi D',
      employeeId: 'MK004',
      branch: 'Cần Thơ',
      department: 'Marketing',
      position: 'Content Specialist',
      hourlyRate: 85000,
      standardHoursPerDay: 8,
      salaryCoefficient: 0.95,
      standardWorkingDays: 22,
      basicSalary: 4700000,
      contractType: 'Xác định thời hạn',
      status: 'Còn hiệu lực',
      validFrom: '01-06-2023',
      validTo: '01-06-2025',
    },
    {
      contractId: 'HD005',
      name: 'Hoang Van E',
      employeeId: 'SL005',
      branch: 'Hải Phòng',
      department: 'Sales',
      position: 'Sales Executive',
      hourlyRate: 95000,
      standardHoursPerDay: 8,
      salaryCoefficient: 1.1,
      standardWorkingDays: 22,
      basicSalary: 5200000,
      contractType: 'Không xác định thời hạn',
      status: 'Còn hiệu lực',
      validFrom: '01-05-2022',
      validTo: '01-05-2026',
    },
    {
      contractId: 'HD006',
      name: 'Tran Van F',
      employeeId: 'PR006',
      branch: 'Nghệ An',
      department: 'Public Relations',
      position: 'PR Manager',
      hourlyRate: 105000,
      standardHoursPerDay: 8,
      salaryCoefficient: 1.3,
      standardWorkingDays: 22,
      basicSalary: 6500000,
      contractType: 'Không xác định thời hạn',
      status: 'Còn hiệu lực',
      validFrom: '01-09-2023',
      validTo: '01-09-2026',
    },
    {
      contractId: 'HD007',
      name: 'Vo Thi G',
      employeeId: 'QA007',
      branch: 'Bình Dương',
      department: 'Quality Assurance',
      position: 'QA Tester',
      hourlyRate: 90000,
      standardHoursPerDay: 8,
      salaryCoefficient: 1.0,
      standardWorkingDays: 22,
      basicSalary: 5000000,
      contractType: 'Xác định thời hạn',
      status: 'Còn hiệu lực',
      validFrom: '01-07-2023',
      validTo: '01-07-2025',
    },
    {
      contractId: 'HD008',
      name: 'Nguyen Van H',
      employeeId: 'IT008',
      branch: 'Hà Nội',
      department: 'IT',
      position: 'Backend Developer',
      hourlyRate: 130000,
      standardHoursPerDay: 8,
      salaryCoefficient: 1.4,
      standardWorkingDays: 22,
      basicSalary: 7000000,
      contractType: 'Không xác định thời hạn',
      status: 'Còn hiệu lực',
      validFrom: '01-02-2023',
      validTo: '01-02-2027',
    },
  ];
  

  const columns = [
    { label: 'Mã nhân sự', key: 'employeeId' },
    { label: 'Họ và tên NLĐ', key: 'name' },
    { label: 'Chi nhánh', key: 'branch' },
    { label: 'Bộ phận', key: 'department' },
    { label: 'Vị trí', key: 'position' },
    { label: 'Mã HĐLĐ', key: 'contractId' },
    { label: 'Loại hợp đồng', key: 'contractType' },
    { label: 'Tình trạng', key: 'status' },
    { label: 'Mức lương /1h', key: 'hourlyRate' },
    { label: 'Số giờ làm việc chuẩn/1 ngày', key: 'standardHoursPerDay' },
    { label: 'Hệ số lương', key: 'salaryCoefficient' },
    { label: 'Ngày công chuẩn', key: 'standardWorkingDays' },
    { label: 'Lương cơ bản', key: 'basicSalary' },
    { label: 'Hiệu lực từ', key: 'validFrom' },
    { label: 'Hiệu lực đến', key: 'validTo' },
  ];

  const columnGroups = [
    {
      label: 'Thông tin hồ sơ nhân sự',
      columns: ['employeeId', 'name', 'branch', 'department', 'position'],
    },
    {
      label: 'Thông tin HĐLĐ',
      columns: ['contractId', 'contractType', 'status', 'hourlyRate', 'standardHoursPerDay', 'salaryCoefficient', 'standardWorkingDays', 'basicSalary', 'validFrom', 'validTo'],
    },
  ];

  const handleEdit = (item) => {
    alert(`Editing contract info of ${item.contractId}`);
  };

  const handleDelete = (item) => {
    alert(`Deleting contract info of ${item.contractId}`);
  };

  const handleAdd = () => {
    navigate('/create/contract');
  };

  const filterData = (data, searchTerm) => {
    return data.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contractId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleCreate = () => {
    navigate('/create/personal'); 
  };

  return (
    <TableComponent
      data={contractData}
      columns={columns}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onAdd={handleAdd}
      filterData={filterData}
      groupBy={columnGroups}
      onCreate={handleCreate}
    />
  );
};

export default HRContract;
