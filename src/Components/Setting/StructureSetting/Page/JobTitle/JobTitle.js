import React, { useState } from "react";
import TableComponent from "../../../../../Shared/Table/Table";
import { useNavigate } from "react-router-dom";
import JobTitleDlg from "./JobTitleDlg/JobTitleDlg";
import { Form, message } from "antd";
import styles from "./styles.module.css";

const JobTitle = () => {
  const navigate = useNavigate();
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [form] = Form.useForm();
  const [jobTitleData, setJobTitleData] = useState([
    {
      jobTitleCode: "JT001",
      jobTitleName: "Nhân viên Kế toán",
      rank: "Cấp 4",
      description: "Thực hiện các công việc kế toán cơ bản.",
      permissionGroup: "Quản trị viên", // Add permission group
    },
    {
      jobTitleCode: "JT002",
      jobTitleName: "Chuyên viên Nhân sự",
      rank: "Cấp 3",
      description: "Quản lý hồ sơ nhân sự và tuyển dụng.",
      permissionGroup: "Người dùng",
    },
    {
      jobTitleCode: "JT003",
      jobTitleName: "Nhân viên Marketing",
      rank: "Cấp 4",
      description: "Hỗ trợ xây dựng chiến lược quảng bá.",
      permissionGroup: "Người dùng",
    },
    {
      jobTitleCode: "JT004",
      jobTitleName: "Kỹ sư Phần mềm",
      rank: "Cấp 3",
      description: "Phát triển và bảo trì phần mềm.",
      permissionGroup: "Quản trị viên",
    },
  ]);

  const columns = [
    { label: "Mã chức vụ", key: "jobTitleCode" },
    { label: "Tên chức vụ", key: "jobTitleName" },
    { label: "Cấp bậc", key: "rank" },
    { label: "Nhóm quyền", key: "permissionGroup" }, // Add permission group column
    { label: "Mô tả", key: "description" },
  ];

  const handleEdit = (item) => {
    alert(`Editing job title: ${item.jobTitleName}`);
  };

  const handleDelete = (item) => {
    alert(`Deleting job title: ${item.jobTitleName}`);
  };

  const handleCreate = () => {
    setIsDialogVisible(true);
  };

  const handleDialogClose = () => {
    form.resetFields();
    setIsDialogVisible(false);
  };

  const handleDialogSubmit = (values) => {
    const newJobTitles = values.jobTitles.map((jobTitle, index) => ({
      jobTitleCode: `JT${(jobTitleData.length + index + 1).toString().padStart(3, "0")}`, // Generate new jobTitleCode
      jobTitleName: jobTitle.title,
      rank: jobTitle.rank,
      permissionGroup: jobTitle.permissionGroup, // Include permission group
      description: jobTitle.description,
    }));
    setJobTitleData([...jobTitleData, ...newJobTitles]);
    setIsDialogVisible(false);
  };

  const filterData = (data, searchTerm) => {
    return data.filter(
      (item) =>
        (item.jobTitleCode || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.jobTitleName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.rank || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.permissionGroup || "").toLowerCase().includes(searchTerm.toLowerCase()) || // Add permission group to search
        (item.description || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className={styles.tableContent}>
      <TableComponent
        data={jobTitleData}
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
      <JobTitleDlg
        visible={isDialogVisible}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        form={form}
      />
    </div>
  );
};

export default JobTitle;