import React from 'react';
import TableComponent from '../../../../Shared/Table/Table';
import { useNavigate } from 'react-router-dom';

const HRPersonal = () => {
  const navigate = useNavigate();

  const personelData = [
    {
      id: 'HR001',
      name: 'Nguyen Van A',
      branch: 'Hà Nội',
      department: 'HR',
      jobTitle: 'Trưởng phòng',
      rank: 'Cấp 3',
      position: 'Manager',
      joinDate: '03-02-2025',
      managedBy: 'Nguyen Van X',
      workType: 'Toàn thời gian',
      lunchBreak: '1 giờ',
      email: 'nguyenvana@company.com',
      phoneNumber: '0123456789',
    },
    {
      id: 'IT002',
      name: 'Tran Thi B',
      branch: 'Hồ Chí Minh',
      department: 'IT',
      jobTitle: 'Lập trình viên',
      rank: 'Cấp 2',
      position: 'Developer',
      joinDate: '03-02-2025',
      managedBy: 'Le Van Y',
      workType: 'Bán thời gian',
      lunchBreak: '1 giờ',
      email: 'tranthib@company.com',
      phoneNumber: '0987654321',
    },
    {
      id: 'FIN003',
      name: 'Le Van C',
      branch: 'Đà Nẵng',
      department: 'Finance',
      jobTitle: 'Kế toán viên',
      rank: 'Cấp 1',
      position: 'Accountant',
      joinDate: '03-02-2025',
      managedBy: 'Pham Thi Z',
      workType: 'Toàn thời gian',
      lunchBreak: '1 giờ',
      email: 'levanc@company.com',
      phoneNumber: '0912345678',
    },
    {
      id: 'MKT004',
      name: 'Pham Thi D',
      branch: 'Hà Nội',
      department: 'Marketing',
      jobTitle: 'Chuyên viên Marketing',
      rank: 'Cấp 2',
      position: 'Specialist',
      joinDate: '03-02-2025',
      managedBy: 'Nguyen Van X',
      workType: 'Toàn thời gian',
      lunchBreak: '1 giờ',
      email: 'phamthid@company.com',
      phoneNumber: '0932145678',
    },
    {
      id: 'HR005',
      name: 'Hoang Van E',
      branch: 'Hà Nội',
      department: 'HR',
      jobTitle: 'Trợ lý nhân sự',
      rank: 'Cấp 1',
      position: 'Assistant',
      joinDate: '03-02-2025',
      managedBy: 'Nguyen Van X',
      workType: 'Toàn thời gian',
      lunchBreak: '1 giờ',
      email: 'hoangvane@company.com',
      phoneNumber: '0123456790',
    },
    {
      id: 'IT006',
      name: 'Nguyen Thi F',
      branch: 'Hồ Chí Minh',
      department: 'IT',
      jobTitle: 'Kiểm thử viên',
      rank: 'Cấp 1',
      position: 'Tester',
      joinDate: '03-02-2025',
      managedBy: 'Le Van Y',
      workType: 'Toàn thời gian',
      lunchBreak: '1 giờ',
      email: 'nguyenthif@company.com',
      phoneNumber: '0987654322',
    },
    {
      id: 'FIN007',
      name: 'Tran Van G',
      branch: 'Đà Nẵng',
      department: 'Finance',
      jobTitle: 'Chuyên viên phân tích',
      rank: 'Cấp 2',
      position: 'Analyst',
      joinDate: '03-02-2025',
      managedBy: 'Pham Thi Z',
      workType: 'Toàn thời gian',
      lunchBreak: '1 giờ',
      email: 'tranvang@company.com',
      phoneNumber: '0912345679',
    },
    {
      id: 'MKT008',
      name: 'Le Thi H',
      branch: 'Hà Nội',
      department: 'Marketing',
      jobTitle: 'Điều phối viên',
      rank: 'Cấp 1',
      position: 'Coordinator',
      joinDate: '03-02-2025',
      managedBy: 'Nguyen Van X',
      workType: 'Bán thời gian',
      lunchBreak: '1 giờ',
      email: 'lethih@company.com',
      phoneNumber: '0932145679',
    },
    {
      id: 'HR009',
      name: 'Pham Van I',
      branch: 'Hà Nội',
      department: 'HR',
      jobTitle: 'Chuyên viên tuyển dụng',
      rank: 'Cấp 2',
      position: 'Recruiter',
      joinDate: '03-02-2025',
      managedBy: 'Nguyen Van X',
      workType: 'Toàn thời gian',
      lunchBreak: '1 giờ',
      email: 'phamvani@company.com',
      phoneNumber: '0123456791',
    },
    {
      id: 'IT010',
      name: 'Nguyen Van K',
      branch: 'Hồ Chí Minh',
      department: 'IT',
      jobTitle: 'Kỹ sư DevOps',
      rank: 'Cấp 3',
      position: 'DevOps',
      joinDate: '03-02-2025',
      managedBy: 'Le Van Y',
      workType: 'Toàn thời gian',
      lunchBreak: '1 giờ',
      email: 'nguyenvank@company.com',
      phoneNumber: '0987654323',
    },
    {
      id: 'FIN011',
      name: 'Tran Thi L',
      branch: 'Đà Nẵng',
      department: 'Finance',
      jobTitle: 'Trưởng phòng tài chính',
      rank: 'Cấp 4',
      position: 'Manager',
      joinDate: '03-02-2025',
      managedBy: 'Pham Thi Z',
      workType: 'Toàn thời gian',
      lunchBreak: '1 giờ',
      email: 'tranthil@company.com',
      phoneNumber: '0912345680',
    },
    {
      id: 'MKT012',
      name: 'Le Van M',
      branch: 'Hà Nội',
      department: 'Marketing',
      jobTitle: 'Nhà thiết kế',
      rank: 'Cấp 2',
      position: 'Designer',
      joinDate: '03-02-2025',
      managedBy: 'Nguyen Van X',
      workType: 'Toàn thời gian',
      lunchBreak: '1 giờ',
      email: 'levanm@company.com',
      phoneNumber: '0932145680',
    },
  ];

  const columns = [
    { label: 'Mã nhân sự', key: 'id' },
    { label: 'Họ và tên NLĐ', key: 'name' },
    { label: 'Chi nhánh', key: 'branch' },
    { label: 'Bộ phận', key: 'department' },
    { label: 'Chức vụ', key: 'jobTitle' },
    { label: 'Cấp bậc', key: 'rank' },
    { label: 'Vị trí', key: 'position' },
    { label: 'Ngày gia nhập', key: 'joinDate' },
    { label: 'Được quản lý bởi', key: 'managedBy' },
    { label: 'Hình thức làm việc', key: 'workType' },
    { label: 'Giờ nghỉ trưa', key: 'lunchBreak' },
    { label: 'Email', key: 'email' },
    { label: 'Số điện thoại', key: 'phoneNumber' },
  ];

  const columnGroups = [
    {
      label: 'Thông tin hồ sơ nhân sự',
      columns: [
        'id',
        'name',
        'branch',
        'department',
        'jobTitle',
        'rank',
        'position',
        'joinDate',
        'managedBy',
        'workType',
        'lunchBreak',
      ],
    },
    {
      label: 'Thông tin liên hệ',
      columns: ['email', 'phoneNumber'],
    },
  ];

  const handleEdit = (item) => {
    alert(`Editing personal info of ${item.id}`);
  };

  const handleDelete = (item) => {
    alert(`Deleting personal info of ${item.id}`);
  };

  const filterData = (data, searchTerm) => {
    return data.filter(
      (item) =>
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <TableComponent
      data={personelData}
      columns={columns}
      onEdit={handleEdit}
      onDelete={handleDelete}
      filterData={filterData}
      showAdd={false}
      groupBy={columnGroups} 
    />
  );
};

export default HRPersonal;