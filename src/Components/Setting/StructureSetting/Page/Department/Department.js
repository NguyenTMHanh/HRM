import React, { useState } from "react";
import TableComponent from "../../../../../Shared/Table/Table";
import { useNavigate } from "react-router-dom";
import DepartmentDlg from "./DepartmentDlg/DepartmentDlg";
import { Form, message } from "antd";
import styles from "./styles.module.css";

const Department = () => {
  const navigate = useNavigate();
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [departmentData, setDepartmentData] = useState([
    {
      departmentCode: "D001",
      departmentName: "Bộ phận Kế toán",
      description: "Quản lý tài chính và kế toán của công ty.",
    },
    {
      departmentCode: "D002",
      departmentName: "Bộ phận Nhân sự",
      description: "Chịu trách nhiệm tuyển dụng và quản lý nhân sự.",
    },
    {
      departmentCode: "D003",
      departmentName: "Bộ phận Marketing",
      description: "Phát triển chiến lược quảng bá thương hiệu.",
    },
    {
      departmentCode: "D004",
      departmentName: "Bộ phận Công nghệ",
      description: "Quản lý hệ thống CNTT và phát triển phần mềm.",
    },
  ]);

  const columns = [
    { label: "Mã bộ phận", key: "departmentCode" },
    { label: "Tên bộ phận", key: "departmentName" },
    { label: "Mô tả", key: "description" },
  ];

  const handleEdit = (item) => {
    setSelectedDepartment(item);
    setIsViewMode(false);
    setIsDialogVisible(true);
  };

  const handleDelete = (item) => {
    alert(`Deleting department: ${item.departmentName}`);
  };

  const handleCreate = () => {
    setSelectedDepartment(null);
    setIsViewMode(false);
    setIsDialogVisible(true);
  };

  const handleView = (item) => {
    setSelectedDepartment(item);
    setIsViewMode(true);
    setIsDialogVisible(true);
  };

  const handleDialogClose = () => {
    setSelectedDepartment(null);
    setIsViewMode(false);
    setIsDialogVisible(false);
    form.resetFields();
  };

  const handleDialogSubmit = (values) => {
    if (selectedDepartment) {
      // Update existing department
      setDepartmentData((prev) =>
        prev.map((item) =>
          item.departmentCode === values.departments[0].departmentCode
            ? {
                ...item,
                departmentName: values.departments[0].name,
                description: values.departments[0].description,
              }
            : item
        )
      );
      message.success("Cập nhật bộ phận thành công!");
    } else {
      // Add new department
      setDepartmentData((prev) => [
        ...prev,
        {
          departmentCode: values.departments[0].departmentCode,
          departmentName: values.departments[0].name,
          description: values.departments[0].description,
        },
      ]);
      message.success("Tạo bộ phận thành công!");
    }
    handleDialogClose();
  };

  const filterData = (data, searchTerm) => {
    return data.filter((item) =>
      (
        item.departmentCode.toLowerCase() +
        item.departmentName.toLowerCase() +
        item.description.toLowerCase()
      ).includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className={styles.tableContent}>
      <TableComponent
        data={departmentData}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showAdd={false}
        showView={true}
        showCreate={true}
        onCreate={handleCreate}
        onBranchShow={false}
        onDepartmentShow={false}
        filterData={filterData}
      />
      <DepartmentDlg
        visible={isDialogVisible}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        form={form}
        selectedDepartment={selectedDepartment}
        isViewMode={isViewMode}
      />
    </div>
  );
};

export default Department;