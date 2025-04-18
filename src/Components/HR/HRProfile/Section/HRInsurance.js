import React from 'react';
import TableComponent from '../../../../Shared/Table/Table';
import { useNavigate } from 'react-router-dom';

const HRInsurance = () => {
  const navigate = useNavigate();

  const insuranceData = [
    {
      employeeId: 'HR001',
      fullName: 'Nguyễn Văn A', 
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
      employeeId: 'HR001',
      fullName: 'Nguyễn Văn A', 
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
      employeeId: 'HR001',
      fullName: 'Nguyễn Văn A', 
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
      employeeId: 'HR001',
      fullName: 'Nguyễn Văn A', 
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
      employeeId: 'HR001',
      fullName: 'Nguyễn Văn A', 
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
      employeeId: 'HR001',
      fullName: 'Nguyễn Văn A', 
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
      employeeId: 'HR001',
      fullName: 'Nguyễn Văn A', 
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
      employeeId: 'HR001',
      fullName: 'Nguyễn Văn A', 
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
      employeeId: 'HR001',
      fullName: 'Nguyễn Văn A', 
      bhytId: 'BHYT12345',
      bhytRate: '4.5%',
      hasBhxh: true,
      bhxhId: 'BHXH67890',
      bhxhRate: '8%',
      bhtnRate: '1%',
      insuranceStatus: 'Đang đóng',
      endDate: '01-01-2026',
    },
  ];

  const columns = [
    { label: 'Mã nhân sự', key: 'employeeId' },
    { label: 'Họ và tên NLĐ', key: 'fullName' }, 
    { label: 'Mã số BHYT', key: 'bhytId' },
    { label: 'Tỷ lệ đóng BHYT', key: 'bhytRate' },
    {
      label: 'Đã tham gia BHXH',
      key: 'hasBhxh',
      type: 'checkbox',
    },
    { label: 'Mã số BHXH', key: 'bhxhId' },
    { label: 'Tỷ lệ đóng BHXH', key: 'bhxhRate' },
    { label: 'Tỷ lệ đóng BHTN', key: 'bhtnRate' },
    { label: 'Tình trạng đóng BH', key: 'insuranceStatus' },
    { label: 'Ngày kết thúc đóng', key: 'endDate' },
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
    return data.filter(item =>
      item.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.bhytId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) 
    );
  };

  return (
    <TableComponent
      data={insuranceData}
      columns={columns}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onAdd={handleAdd}
      filterData={filterData}
    />
  );
};

export default HRInsurance;