import React, { useState } from "react";
import TableComponent from "../../../../../Shared/Table/Table";
import { useNavigate } from "react-router-dom";
import RankDlg from "./RankDlg/RankDlg";
import { Form, message } from "antd";
import styles from "./styles.module.css";

const Rank = () => {
  const navigate = useNavigate();
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [form] = Form.useForm();
  const [rankData, setRankData] = useState([
    {
      rankCode: "R004",
      priority: 1,
      rankName: "Cấp 1",
      description: "Quản lý toàn bộ chi nhánh hoặc khu vực.",
    },
    {
      rankCode: "R003",
      priority: 2,
      rankName: "Cấp 2",
      description: "Chịu trách nhiệm quản lý một bộ phận.",
    },
    {
      rankCode: "R002",
      priority: 3,
      rankName: "Cấp 3",
      description: "Quản lý một nhóm nhỏ nhân viên.",
    },
    {
      rankCode: "R001",
      priority: 4,
      rankName: "Cấp 4",
      description: "Cấp bậc cơ bản cho nhân viên mới.",
    },
  ]);

  const columns = [
    { label: "Mã số cấp bậc", key: "rankCode" },
    { label: "Mức độ ưu tiên", key: "priority" },
    { label: "Tên cấp bậc", key: "rankName" },
    { label: "Mô tả", key: "description" },
  ];

  const handleEdit = (item) => {
    alert(`Editing rank: ${item.rankName}`);
  };

  const handleDelete = (item) => {
    alert(`Deleting rank: ${item.rankName}`);
  };

  const handleCreate = () => {
    setIsDialogVisible(true);
  };

  const handleDialogClose = () => {
    form.resetFields();
    setIsDialogVisible(false);
  };

  const handleDialogSubmit = (values) => {
    setIsDialogVisible(false);
  };

  const filterData = (data, searchTerm) => {
    return data.filter(
      (item) =>
        item.rankCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(item.priority).includes(searchTerm) ||
        item.rankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className={styles.tableContent}>
      <TableComponent
        data={rankData}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showAdd={false}
        showView={false}
        showCreate={true}
        onCreate={handleCreate}
        onBranchShow={false}
        onDepartmentShow={false}
        filterData={filterData}
      />
      <RankDlg
        visible={isDialogVisible}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        form={form}
      />
    </div>
  );
};

export default Rank;