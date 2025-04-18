import React from 'react';
import TableComponent from '../../../../Shared/Table/Table';
import { useNavigate } from 'react-router-dom';

const HRTax = () => {
  const navigate = useNavigate();

  const taxData = [
    {
      employeeId: 'HR001',
      fullName: 'Nguyễn Văn A',
      hasTaxCode: true,
      taxCode: 'TNCN123456',
      dependents: 2,
    },
    {
      employeeId: 'IT002',
      fullName: 'Trần Thị B',
      hasTaxCode: false,
      taxCode: 'TNCN789012',
      dependents: 1,
    },
    {
      employeeId: 'FIN003',
      fullName: 'Lê Văn C',
      hasTaxCode: true,
      taxCode: 'TNCN345678',
      dependents: 0,
    },
    {
      employeeId: 'HR004',
      fullName: 'Phạm Thị D',
      hasTaxCode: true,
      taxCode: 'TNCN901234',
      dependents: 3,
    },
    {
      employeeId: 'IT005',
      fullName: 'Hoàng Văn E',
      hasTaxCode: false,
      taxCode: 'TNCN567890',
      dependents: 2,
    },
    {
      employeeId: 'FIN006',
      fullName: 'Ngô Thị F',
      hasTaxCode: true,
      taxCode: 'TNCN234567',
      dependents: 1,
    },
    {
      employeeId: 'HR007',
      fullName: 'Đinh Văn G',
      hasTaxCode: true,
      taxCode: 'TNCN890123',
      dependents: 0,
    },
    {
      employeeId: 'IT008',
      fullName: 'Vũ Thị H',
      hasTaxCode: false,
      taxCode: 'TNCN456789',
      dependents: 2,
    },
    {
      employeeId: 'FIN009',
      fullName: 'Bùi Văn I',
      hasTaxCode: true,
      taxCode: 'TNCN012345',
      dependents: 1,
    },
  ];

  const columns = [
    { label: 'Mã số nhân sự', key: 'employeeId' },
    { label: 'Họ và tên NLĐ', key: 'fullName' },
    {
      label: 'Đã có mã số thuế TNCN',
      key: 'hasTaxCode',
      type: 'checkbox',
    },
    { label: 'Mã số thuế TNCN', key: 'taxCode' },
    { label: 'Số lượng người phụ thuộc', key: 'dependents' },
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
    return data.filter(item =>
      item.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.taxCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <TableComponent
      data={taxData}
      columns={columns}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onAdd={handleAdd}
      filterData={filterData}
    />
  );
};

export default HRTax;