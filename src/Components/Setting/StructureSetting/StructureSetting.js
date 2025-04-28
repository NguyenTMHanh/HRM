import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CustomTabs from "../../../Shared/Tabs/Tabs";
import Rank from "./Page/Rank/Rank";
import Branch from "./Page/Branch/Branch";
import Department from "./Page/Department/Department";
import StructureView from "./Page/StructureView/StructureView";
import JobTitle from "./Page/JobTitle/JobTitle";
import Position from "./Page/Position/Position";
import styles from "./styles.module.css";

const StructureSetting = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabFromUrl = location.pathname.split("/")[3] || "branch";

  const items = [
    { key: "rank", label: "Cấp bậc", children: <Rank /> },
    { key: "department", label: "Bộ phận", children: <Department /> },
    { key: "jobtitle", label: "Chức vụ", children: <JobTitle /> },
    { key: "position", label: "Vị trí", children: <Position /> },
    { key: "branch", label: "Chi nhánh", children: <Branch /> },
    //{ key: "view", label: "Xem cơ cấu tổ chức", children: <StructureView /> },
  ];

  const handleTabChange = (key) => {
    navigate(`/setting/structure/${key}`);
  };

  return (
    <div className={styles.headerTabs}>
      <CustomTabs
        items={items}
        activeKey={tabFromUrl}
        onChange={handleTabChange}
      />
    </div>
  );
};

export default StructureSetting;