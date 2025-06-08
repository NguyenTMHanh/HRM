import React from 'react';
import TableComponent from '../../../../Shared/Table/Table';
import { useNavigate } from 'react-router-dom';

const HRPersonel = () => {
  const navigate = useNavigate();

  const personelData = [
    {
      id: 'HR001',
      name: 'Nguyen Van A',
      avatar: '/avatar.jpg', 
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
      avatar: '/avatar.jpg', 
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
      avatar: '/avatar.jpg',
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
      avatar: '/avatar.jpg',
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
  ].map((item, index) => ({
    ...item,
    stt: index + 1,
  }));

  const columns = [
    { label: 'STT', key: 'stt' },
    {
      label: 'Mã nhân sự', key: 'avatar', render: (value, item) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={value} alt={`${item.name}'s avatar`} style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} />
          <span>{item.id}</span>
        </div>
      )
    },
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
      columns: ['avatar', 'stt', 'name', 'branch', 'department', 'jobTitle', 'rank', 'position', 'joinDate', 'managedBy', 'workType', 'lunchBreak'],
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

  const handleCreate = () => {
    navigate('/create/personal');
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
      onCreate={handleCreate}
    />
  );
};

export default HRPersonel;