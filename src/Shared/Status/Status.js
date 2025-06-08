import React from "react";
import styles from "./styles.module.css";

const Status = ({ status, type }) => {
  const isActive = status === "active";
  const displayText =
    type === "contract"
      ? isActive
        ? "Còn hiệu lực"
        : "Hết hiệu lực"
      : type === "insurance"
      ? isActive
        ? "Đang tham gia"
        : "Ngừng đóng"
      : isActive
      ? "Đang hoạt động"
      : "Ngừng hoạt động";

  return (
    <span
      className={`${styles.status} ${
        isActive ? styles.active : styles.inactive
      }`}
    >
      {displayText}
    </span>
  );
};

export default Status;