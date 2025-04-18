import React, { useState } from 'react';
import TableComponent from '../../../../Shared/Table/Table';
import { useNavigate } from "react-router-dom";

const HRPersonal = () => {
  const navigate = useNavigate();
  
  const personelData = [
    {
      id: "HR001",
      name: "Nguyen Van A",
      joinDate: "03-02-2025",
      department: "HR",
      position: "Manager",
      branch: "Hanoi",
      phoneNumber: "0123456789",
      email: "nguyenvana@company.com",
    },
    {
      id: "IT002",
      name: "Tran Thi B",
      joinDate: "03-02-2025",
      department: "IT",
      position: "Developer",
      branch: "Ho Chi Minh",
      phoneNumber: "0987654321",
      email: "tranthib@company.com",
    },
    {
      id: "FIN003",
      name: "Le Van C",
      joinDate: "03-02-2025",
      department: "Finance",
      position: "Accountant",
      branch: "Da Nang",
      phoneNumber: "0912345678",
      email: "levanc@company.com",
    },
    {
      id: "MKT004",
      name: "Pham Thi D",
      joinDate: "03-02-2025",
      department: "Marketing",
      position: "Specialist",
      branch: "Hanoi",
      phoneNumber: "0932145678",
      email: "phamthid@company.com",
    },
    {
      id: "HR005",
      name: "Hoang Van E",
      joinDate: "03-02-2025",
      department: "HR",
      position: "Assistant",
      branch: "Hanoi",
      phoneNumber: "0123456790",
      email: "hoangvane@company.com",
    },
    {
      id: "IT006",
      name: "Nguyen Thi F",
      joinDate: "03-02-2025",
      department: "IT",
      position: "Tester",
      branch: "Ho Chi Minh",
      phoneNumber: "0987654322",
      email: "nguyenthif@company.com",
    },
    {
      id: "FIN007",
      name: "Tran Van G",
      joinDate: "03-02-2025",
      department: "Finance",
      position: "Analyst",
      branch: "Da Nang",
      phoneNumber: "0912345679",
      email: "tranvang@company.com",
    },
    {
      id: "MKT008",
      name: "Le Thi H",
      joinDate: "03-02-2025",
      department: "Marketing",
      position: "Coordinator",
      branch: "Hanoi",
      phoneNumber: "0932145679",
      email: "lethih@company.com",
    },
    {
      id: "HR009",
      name: "Pham Van I",
      joinDate: "03-02-2025",
      department: "HR",
      position: "Recruiter",
      branch: "Hanoi",
      phoneNumber: "0123456791",
      email: "phamvani@company.com",
    },
    {
      id: "IT010",
      name: "Nguyen Van K",
      joinDate: "03-02-2025",
      department: "IT",
      position: "DevOps",
      branch: "Ho Chi Minh",
      phoneNumber: "0987654323",
      email: "nguyenvank@company.com",
    },
    {
      id: "FIN011",
      name: "Tran Thi L",
      joinDate: "03-02-2025",
      department: "Finance",
      position: "Manager",
      branch: "Da Nang",
      phoneNumber: "0912345680",
      email: "tranthil@company.com",
    },
    {
      id: "MKT012",
      name: "Le Van M",
      joinDate: "03-02-2025",
      department: "Marketing",
      position: "Designer",
      branch: "Hanoi",
      phoneNumber: "0932145680",
      email: "levanm@company.com",
    },
  ];

  const columns = [
    { label: "Mã nhân sự", key: "id" },
    { label: "Họ và tên NLĐ", key: "name" },
    { label: "Ngày bắt đầu", key: "joinDate" },
    { label: "Bộ phận", key: "department" },
    { label: "Vị trí", key: "position" },
    { label: "Chi nhánh làm việc", key: "branch" },
    { label: "Số điện thoại", key: "phoneNumber" },
    { label: "Email", key: "email" },
  ];

  const handleEdit = (item) => {
    alert(`Editing insurance info of ${item.employeeId}`);
  };

  const handleDelete = (item) => {
    alert(`Deleting insurance info of ${item.employeeId}`);
  };
  const filterData = (data, searchTerm) => {
    return data.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
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
      />
  );
};

export default HRPersonal;