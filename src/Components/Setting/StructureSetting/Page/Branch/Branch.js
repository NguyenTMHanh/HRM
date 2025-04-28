import React, { useState } from "react";
import TableComponent from "../../../../../Shared/Table/Table";
import Status from "../../../../../Shared/Status/Status";
import { useNavigate } from "react-router-dom";
import BranchCreateDlg from "./BranchCreateDlg/BranchCreateDlg";
import styles from "./styles.module.css";
import { Form } from "antd";

const Branch = () => {
  const navigate = useNavigate();
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [form] = Form.useForm();
  const [structureData, setStructureData] = useState([
    {
      branchCode: "HN001",
      branchName: "Chi nhánh Hà Nội",
      address: "Tòa nhà A, 123 Đường Láng, Đống Đa, Hà Nội",
      status: "active",
      departments: ["Kế toán", "Nhân sự", "Kinh doanh"],
    },
    {
      branchCode: "HCM002",
      branchName: "Chi nhánh Hồ Chí Minh",
      address: "Tòa nhà B, 456 Lê Lợi, Quận 1, TP. Hồ Chí Minh",
      status: "inactive",
      departments: ["Kỹ thuật", "Marketing"],
    },
    {
      branchCode: "DN003",
      branchName: "Chi nhánh Đà Nẵng",
      address: "Tòa nhà C, 789 Nguyễn Văn Linh, Hải Châu, Đà Nẵng",
      status: "active",
      departments: ["Dịch vụ khách hàng", "Phát triển sản phẩm"],
    },
    {
      branchCode: "CT004",
      branchName: "Chi nhánh Cần Thơ",
      address: "Tòa nhà D, 321 Nguyễn Trãi, Ninh Kiều, Cần Thơ",
      status: "inactive",
      departments: ["Hậu cần", "Quản lý chất lượng"],
    },
  ]);

  const columns = [
    { label: "Mã chi nhánh", key: "branchCode" },
    { label: "Tên chi nhánh", key: "branchName" },
    { label: "Địa chỉ", key: "address" },
    {
      label: "Bộ phận",
      key: "departments",
      render: (departments) => (
        <div>
          {departments.map((dept, index) => (
            <div key={index}>{dept}</div>
          ))}
        </div>
      ),
    },
    {
      label: "Trạng thái",
      key: "status",
      render: (status) => <Status status={status} />,
    },
  ];

  const handleEdit = (item) => {
    alert(`Editing branch: ${item.branchName}`);
  };

  const handleDelete = (item) => {
    alert(`Deleting branch: ${item.branchName}`);
  };

  const handleCreate = () => {
    setIsDialogVisible(true);
  };

  const handleDialogClose = () => {
    setIsDialogVisible(false);
  };

  const handleDialogSubmit = (values) => {
    const newBranch = {
      ...values,
      departments: Array.isArray(values.departments)
        ? values.departments
        : values.departments.split(",").map((dept) => dept.trim()),
    };
    setStructureData([...structureData, newBranch]);
    setIsDialogVisible(false);
  };

  const filterData = (data, searchTerm) => {
    return data.filter((item) => {
      const search = searchTerm.toLowerCase();
      return (
        (item.branchCode || "").toLowerCase().includes(search) ||
        (item.branchName || "").toLowerCase().includes(search) ||
        (item.status === "active" ? "đang hoạt động" : "ngừng hoạt động").toLowerCase().includes(search) ||
        (item.departments || []).some((dept) => (dept || "").toLowerCase().includes(search))
      );
    });
  };

  return (
    <div className={styles.tableContent}>
      <TableComponent
        data={structureData}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showAdd={false}
        showCreate={true}
        showView={false}
        onCreate={handleCreate}
        onBranchShow={false}
        onDepartmentShow={false}
        filterData={filterData}
      />
      <BranchCreateDlg
        visible={isDialogVisible}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        form={form}
      />
    </div>
  );
};

export default Branch;