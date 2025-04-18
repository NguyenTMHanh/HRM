import React, { useState } from 'react';
import TableComponent from '../../../../Shared/Table/Table';
import { useNavigate } from 'react-router-dom';

const HRContract = () => {
  const navigate = useNavigate();

  const contractData = [
    {
      contractId: "HD001",
      name: "Nguyen Van A",
      employeeId: "HR001",
      department: "HR",
      position: "Manager",
      contractType: "Không xác định thời hạn",
      status: "Còn hiệu lực",
      validFrom: "01-01-2023",
      validTo: "31-12-2025",
    },
    {
      contractId: "HD002",
      name: "Tran Thi B",
      employeeId: "IT002",
      department: "IT",
      position: "Developer",
      contractType: "Xác định thời hạn",
      status: "Hết hiệu lực",
      validFrom: "01-01-2022",
      validTo: "31-12-2023",
    },
    {
      contractId: "HD003",
      name: "Le Van C",
      employeeId: "FIN003",
      department: "Finance",
      position: "Accountant",
      contractType: "Không xác định thời hạn",
      status: "Còn hiệu lực",
      validFrom: "15-03-2023",
      validTo: "15-03-2026",
    },
    {
        contractId: "HD001",
        name: "Nguyen Van A",
        employeeId: "HR001",
        department: "HR",
        position: "Manager",
        contractType: "Không xác định thời hạn",
        status: "Còn hiệu lực",
        validFrom: "01-01-2023",
        validTo: "31-12-2025",
      },
      {
        contractId: "HD002",
        name: "Tran Thi B",
        employeeId: "IT002",
        department: "IT",
        position: "Developer",
        contractType: "Xác định thời hạn",
        status: "Hết hiệu lực",
        validFrom: "01-01-2022",
        validTo: "31-12-2023",
      },
      {
        contractId: "HD003",
        name: "Le Van C",
        employeeId: "FIN003",
        department: "Finance",
        position: "Accountant",
        contractType: "Không xác định thời hạn",
        status: "Còn hiệu lực",
        validFrom: "15-03-2023",
        validTo: "15-03-2026",
      },
      {
        contractId: "HD001",
        name: "Nguyen Van A",
        employeeId: "HR001",
        department: "HR",
        position: "Manager",
        contractType: "Không xác định thời hạn",
        status: "Còn hiệu lực",
        validFrom: "01-01-2023",
        validTo: "31-12-2025",
      },
      {
        contractId: "HD002",
        name: "Tran Thi B",
        employeeId: "IT002",
        department: "IT",
        position: "Developer",
        contractType: "Xác định thời hạn",
        status: "Hết hiệu lực",
        validFrom: "01-01-2022",
        validTo: "31-12-2023",
      },
      {
        contractId: "HD003",
        name: "Le Van C",
        employeeId: "FIN003",
        department: "Finance",
        position: "Accountant",
        contractType: "Không xác định thời hạn",
        status: "Còn hiệu lực",
        validFrom: "15-03-2023",
        validTo: "15-03-2026",
      },
  ];

  const columns = [
    { label: "Mã nhân sự", key: "contractId" },
    { label: "Họ và tên NLĐ", key: "name" },
    { label: "Mã nhân sự", key: "employeeId" },
    { label: "Bộ phận", key: "department" },
    { label: "Vị trí", key: "position" },
    { label: "Loại hợp đồng", key: "contractType" },
    { label: "Trạng thái", key: "status" },
    { label: "Hiệu lực từ", key: "validFrom" },
    { label: "Hiệu lực đến", key: "validTo" },
  ];

  const handleEdit = (item) => {
    alert(`Editing insurance info of ${item.employeeId}`);
  };

  const handleDelete = (item) => {
    alert(`Deleting insurance info of ${item.employeeId}`);
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

  return (
      <TableComponent
        data={contractData}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        filterData={filterData}
      />
  );
};

export default HRContract;
