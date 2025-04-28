import React from "react";
import styles from "./styles.module.css";

const Status = ({ status }) => {
  const isActive = status === "active";
  return (
    <span
      className={`${styles.status} ${
        isActive ? styles.active : styles.inactive
      }`}
    >
      {isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
    </span>
  );
};

export default Status;