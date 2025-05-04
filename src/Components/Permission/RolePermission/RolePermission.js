import React, { useState } from "react";
import TableComponent from "../../../Shared/Table/Table";
import { useNavigate } from "react-router-dom";
import RolePermissionDlg from "./Dialog/RolePermissionDlg";
import styles from "./styles.module.css";
import { Form, message } from "antd";

const RolePermission = () => {
  const navigate = useNavigate();
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [roleData, setRoleData] = useState([
    {
      roleCode: "ROLE001",
      roleName: "Quản trị viên",
      description: "Có toàn quyền quản lý hệ thống",
      position: "Admin",
      permissions: {
        view_contract: true,
        edit_contract: true,
        delete_contract: true,
      },
    },
    {
      roleCode: "ROLE002",
      roleName: "Nhân sự",
      description: "Quản lý thông tin nhân sự và lương",
      position: "HR Manager",
      permissions: {
        view_contract: true,
        edit_contract: true,
        delete_contract: false,
      },
    },
    {
      roleCode: "ROLE003",
      roleName: "Kế toán",
      description: "Quản lý tài chính và báo cáo",
      position: "Accountant",
      permissions: {
        view_contract: true,
        edit_contract: false,
        delete_contract: false,
      },
    },
    // Các role khác giữ nguyên hoặc thêm permissions tương tự
  ]);

  const columns = [
    { label: "Mã nhóm quyền", key: "roleCode" },
    { label: "Tên nhóm quyền", key: "roleName" },
    { label: "Mô tả", key: "description" },
    {
      label: "Chức vụ",
      key: "position",
      render: (position) => <div>{position}</div>,
    },
  ];

  const handleEdit = (item) => {
    setSelectedRole(item);
    setIsViewMode(false);
    setIsDialogVisible(true);
  };

  const handleDelete = (item) => {
    alert(`Deleting role: ${item.roleName}`);
  };

  const handleCreate = () => {
    setSelectedRole(null);
    setIsViewMode(false);
    setIsDialogVisible(true);
  };

  const handleView = (item) => {
    setSelectedRole(item);
    setIsViewMode(true);
    setIsDialogVisible(true);
  };

  const handleDialogClose = () => {
    form.resetFields();
    setIsDialogVisible(false);
    setSelectedRole(null);
    setIsViewMode(false);
  };

  const handleDialogSubmit = (values) => {
    if (selectedRole) {
      console.log("Call Api edit:", values);
      message.success("Cập nhật nhóm quyền thành công!");
    } else {
      console.log("Call Api create:", values);
      message.success("Tạo nhóm quyền thành công!");
    }
    setIsDialogVisible(false);
    form.resetFields();
  };

  const filterData = (data, searchTerm) => {
    return data.filter((item) => {
      const search = searchTerm.toLowerCase();
      return (
        (item.roleCode || "").toLowerCase().includes(search) ||
        (item.roleName || "").toLowerCase().includes(search)
      );
    });
  };

  return (
    <div className={styles.tableContent}>
      <TableComponent
        data={roleData}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showAdd={false}
        showCreate={true}
        showView={true}
        onCreate={handleCreate}
        onBranchShow={false}
        onDepartmentShow={false}
        filterData={filterData}
      />
      <RolePermissionDlg
        visible={isDialogVisible}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        form={form}
        selectedRole={selectedRole}
        isViewMode={isViewMode}
      />
    </div>
  );
};

export default RolePermission;