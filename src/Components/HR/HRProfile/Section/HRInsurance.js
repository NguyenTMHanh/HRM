import React from 'react';
import TableComponent from '../../../../Shared/Table/Table';
import { useNavigate } from 'react-router-dom';

const HRInsurance = () => {
  const navigate = useNavigate();

  const insuranceData = [
    {
      employeeId: 'HR001',
      fullName: 'Nguyễn Văn A',
      branch: 'Hà Nội',
      department: 'Nhân sự',
      position: 'Chuyên viên',
      bhytId: 'BHYT12345',
      bhytRate: '4.5%',
      hasBhxh: true,
      bhxhId: 'BHXH67890',
      bhxhRate: '8%',
      bhtnRate: '1%',
      insuranceStatus: 'Đang đóng',
      endDate: '01-01-2026',
    },
    {
      employeeId: 'HR002',
      fullName: 'Trần Thị B',
      branch: 'Hồ Chí Minh',
      department: 'Kế toán',
      position: 'Kế toán trưởng',
      bhytId: 'BHYT12346',
      bhytRate: '4.5%',
      hasBhxh: true,
      bhxhId: 'BHXH67891',
      bhxhRate: '8%',
      bhtnRate: '1%',
      insuranceStatus: 'Đang đóng',
      endDate: '01-01-2027',
    },
    {
      employeeId: 'HR003',
      fullName: 'Lê Minh C',
      branch: 'Đà Nẵng',
      department: 'IT',
      position: 'Lập trình viên',
      bhytId: 'BHYT12347',
      bhytRate: '4.5%',
      hasBhxh: false,
      bhxhId: '',
      bhxhRate: '0%',
      bhtnRate: '1%',
      insuranceStatus: 'Chưa đóng',
      endDate: 'N/A',
    },
    {
      employeeId: 'HR004',
      fullName: 'Phan Thị D',
      branch: 'Hà Nội',
      department: 'Marketing',
      position: 'Giám đốc marketing',
      bhytId: 'BHYT12348',
      bhytRate: '4.5%',
      hasBhxh: true,
      bhxhId: 'BHXH67892',
      bhxhRate: '8%',
      bhtnRate: '1%',
      insuranceStatus: 'Đang đóng',
      endDate: '01-01-2025',
    },
    {
      employeeId: 'HR005',
      fullName: 'Vũ Hoàng E',
      branch: 'Hồ Chí Minh',
      department: 'Sản xuất',
      position: 'Quản lý sản xuất',
      bhytId: 'BHYT12349',
      bhytRate: '4.5%',
      hasBhxh: true,
      bhxhId: 'BHXH67893',
      bhxhRate: '8%',
      bhtnRate: '1%',
      insuranceStatus: 'Đang đóng',
      endDate: '01-01-2028',
    },
    {
      employeeId: 'HR006',
      fullName: 'Nguyễn Minh F',
      branch: 'Đà Nẵng',
      department: 'Nhân sự',
      position: 'Chuyên viên',
      bhytId: 'BHYT12350',
      bhytRate: '4.5%',
      hasBhxh: true,
      bhxhId: 'BHXH67894',
      bhxhRate: '8%',
      bhtnRate: '1%',
      insuranceStatus: 'Đang đóng',
      endDate: '01-01-2029',
    },
    {
      employeeId: 'HR007',
      fullName: 'Trương Thị G',
      branch: 'Hà Nội',
      department: 'Hành chính',
      position: 'Trưởng phòng hành chính',
      bhytId: 'BHYT12351',
      bhytRate: '4.5%',
      hasBhxh: true,
      bhxhId: 'BHXH67895',
      bhxhRate: '8%',
      bhtnRate: '1%',
      insuranceStatus: 'Đang đóng',
      endDate: '01-01-2027',
    },
    {
      employeeId: 'HR008',
      fullName: 'Đặng Ngọc H',
      branch: 'Hồ Chí Minh',
      department: 'Kỹ thuật',
      position: 'Kỹ sư',
      bhytId: 'BHYT12352',
      bhytRate: '4.5%',
      hasBhxh: false,
      bhxhId: '',
      bhxhRate: '0%',
      bhtnRate: '1%',
      insuranceStatus: 'Chưa đóng',
      endDate: 'N/A',
    },
    {
      employeeId: 'HR009',
      fullName: 'Hoàng Thị I',
      branch: 'Đà Nẵng',
      department: 'Tài chính',
      position: 'Kế toán',
      bhytId: 'BHYT12353',
      bhytRate: '4.5%',
      hasBhxh: true,
      bhxhId: 'BHXH67896',
      bhxhRate: '8%',
      bhtnRate: '1%',
      insuranceStatus: 'Đang đóng',
      endDate: '01-01-2026',
    },
    {
      employeeId: 'HR010',
      fullName: 'Lý Minh J',
      branch: 'Hà Nội',
      department: 'Bán hàng',
      position: 'Nhân viên bán hàng',
      bhytId: 'BHYT12354',
      bhytRate: '4.5%',
      hasBhxh: true,
      bhxhId: 'BHXH67897',
      bhxhRate: '8%',
      bhtnRate: '1%',
      insuranceStatus: 'Đang đóng',
      endDate: '01-01-2027',
    },
  ];

  const columns = [
    { label: 'Mã nhân sự', key: 'employeeId' },
    { label: 'Họ và tên NLĐ', key: 'fullName' },
    { label: 'Chi nhánh', key: 'branch' }, // Added branch column
    { label: 'Bộ phận', key: 'department' },
    { label: 'Vị trí', key: 'position' },
    { label: 'Mã số BHYT', key: 'bhytId' },
    { label: 'Tỷ lệ đóng BHYT', key: 'bhytRate' },
    { label: 'Đã tham gia BHXH', key: 'hasBhxh', type: 'checkbox' },
    { label: 'Mã số BHXH', key: 'bhxhId' },
    { label: 'Tỷ lệ đóng BHXH', key: 'bhxhRate' },
    { label: 'Tỷ lệ đóng BHTN', key: 'bhtnRate' },
    { label: 'Tình trạng đóng BH', key: 'insuranceStatus' },
    { label: 'Ngày kết thúc đóng', key: 'endDate' },
  ];

  const columnGroups = [
    {
      label: 'Thông tin hồ sơ nhân sự',
      columns: ['employeeId', 'fullName', 'branch', 'department', 'position'], // Added branch to group
    },
    { label: 'Thông tin BHYT', columns: ['bhytId', 'bhytRate'] },
    { label: 'Thông tin BHXH', columns: ['hasBhxh', 'bhxhId', 'bhxhRate'] },
    { label: 'Thông tin BHTN', columns: ['bhtnRate'] },
    { label: 'Thông tin chung đóng BH', columns: ['insuranceStatus', 'endDate'] },
  ];

  const handleEdit = (item) => {
    alert(`Editing insurance info of ${item.employeeId}`);
  };

  const handleDelete = (item) => {
    alert(`Deleting insurance info of ${item.employeeId}`);
  };

  const handleAdd = () => {
    navigate('/create/insurance');
  };

  const filterData = (data, searchTerm) => {
    return data.filter(
      (item) =>
        item.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleCreate = () => {
    navigate('/create/personal'); 
  };

  return (
    <TableComponent
      data={insuranceData}
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

export default HRInsurance;