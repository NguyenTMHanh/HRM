import React from 'react';
import TableComponent from '../../../../Shared/Table/Table';
import { useNavigate } from 'react-router-dom';

const HRTax = () => {
  const navigate = useNavigate();

  const taxData = [
    {
      employeeId: 'HR001',
      fullName: 'Nguyễn Văn A',
      branch: 'Hà Nội',
      department: 'Nhân sự',
      position: 'Chuyên viên',
      hasTaxCode: true,
      taxCode: 'TNCN123456',
      dependents: 2,
      avatar: '/avatar.jpg', // Added avatar
    },
    {
      employeeId: 'IT002',
      fullName: 'Trần Thị B',
      branch: 'Hồ Chí Minh',
      department: 'Công nghệ thông tin',
      position: 'Kỹ sư phần mềm',
      hasTaxCode: false,
      taxCode: 'TNCN789012',
      dependents: 1,
      avatar: '/avatar.jpg', // Added avatar
    },
    {
      employeeId: 'FIN003',
      fullName: 'Lê Văn C',
      branch: 'Đà Nẵng',
      department: 'Tài chính',
      position: 'Kế toán viên',
      hasTaxCode: true,
      taxCode: 'TNCN345678',
      dependents: 0,
      avatar: '/avatar.jpg', // Added avatar
    },
    {
      employeeId: 'HR004',
      fullName: 'Phạm Thị D',
      branch: 'Hà Nội',
      department: 'Nhân sự',
      position: 'Trưởng phòng',
      hasTaxCode: true,
      taxCode: 'TNCN901234',
      dependents: 3,
      avatar: '/avatar.jpg', // Added avatar
    },
    {
      employeeId: 'IT005',
      fullName: 'Hoàng Văn E',
      branch: 'Hồ Chí Minh',
      department: 'Công nghệ thông tin',
      position: 'Chuyên viên IT',
      hasTaxCode: false,
      taxCode: 'TNCN567890',
      dependents: 2,
      avatar: '/avatar.jpg', // Added avatar
    },
    {
      employeeId: 'FIN006',
      fullName: 'Ngô Thị F',
      branch: 'Đà Nẵng',
      department: 'Tài chính',
      position: 'Chuyên viên tài chính',
      hasTaxCode: true,
      taxCode: 'TNCN234567',
      dependents: 1,
      avatar: '/avatar.jpg', // Added avatar
    },
    {
      employeeId: 'HR007',
      fullName: 'Đinh Văn G',
      branch: 'Hà Nội',
      department: 'Nhân sự',
      position: 'Nhân viên hành chính',
      hasTaxCode: true,
      taxCode: 'TNCN890123',
      dependents: 0,
      avatar: '/avatar.jpg', // Added avatar
    },
    {
      employeeId: 'IT008',
      fullName: 'Vũ Thị H',
      branch: 'Hồ Chí Minh',
      department: 'Công nghệ thông tin',
      position: 'Lập trình viên',
      hasTaxCode: false,
      taxCode: 'TNCN456789',
      dependents: 2,
      avatar: '/avatar.jpg', // Added avatar
    },
    {
      employeeId: 'FIN009',
      fullName: 'Bùi Văn I',
      branch: 'Đà Nẵng',
      department: 'Tài chính',
      position: 'Kế toán trưởng',
      hasTaxCode: true,
      taxCode: 'TNCN012345',
      dependents: 1,
      avatar: '/avatar.jpg', // Added avatar
    },
  ].map((item, index) => ({
    ...item,
    stt: index + 1, // Added stt
  }));

  const columns = [
    { label: 'STT', key: 'stt' }, // Added STT column
    {
      label: 'Mã số nhân sự',
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
    }, // Added avatar column with custom rendering
    { label: 'Họ và tên NLĐ', key: 'fullName' },
    { label: 'Chi nhánh', key: 'branch' },
    { label: 'Bộ phận', key: 'department' },
    { label: 'Vị trí', key: 'position' },
    {
      label: 'Đã có mã số thuế TNCN',
      key: 'hasTaxCode',
      type: 'checkbox',
    },
    { label: 'Mã số thuế TNCN', key: 'taxCode' },
    { label: 'Số lượng người phụ thuộc', key: 'dependents' },
  ];

  const columnGroups = [
    {
      label: 'Thông tin hồ sơ nhân sự',
      columns: ['stt', 'avatar', 'fullName', 'branch', 'department', 'position'], // Added stt and avatar to group
    },
    {
      label: 'Thông tin thuế TNCN',
      columns: ['hasTaxCode', 'taxCode', 'dependents'],
    },
  ];

  const handleEdit = (item) => {
    alert(`Editing tax info of ${item.employeeId}`);
  };

  const handleDelete = (item) => {
    alert(`Deleting tax info of ${item.employeeId}`);
  };

  const handleAdd = () => {
    navigate('/create/tax');
  };

  const filterData = (data, searchTerm) => {
    return data.filter((item) =>
      item.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.taxCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleCreate = () => {
    navigate('/create/personal');
  };

  return (
    <TableComponent
      data={taxData}
      columns={columns}
      onEdit={handleEdit}
      onDelete={handleDelete}
      showAdd={false}
      filterData={filterData}
      groupBy={columnGroups}
      onCreate={handleCreate}
    />
  );
};

export default HRTax;