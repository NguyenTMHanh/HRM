import React from "react";
import Collapse from "../../../Shared/Collapse/Collapse";
import Checkin from "./Section/Checkin";
import WorkType from "./Section/WorkType";
import Holiday from "./Section/Holiday";
import BreakLunch from "./Section/BreakLunch";
import styles from "./styles.module.css";

function CheckinSetting() {
  return (
    <>
        <div className={styles.collapseWrapper}>
          <div className={styles.scrollContainer}>
            <div className={styles.collapseContainer}>
              <Collapse
                item={{
                  key: "1",
                  header: "Cài đặt thời gian Checkin/Checkout",
                  children: <Checkin />,
                }}
              />
            </div>

            <div className={styles.collapseContainer}>
              <Collapse
                item={{
                  key: "2",
                  header: "Cài đặt thời gian nghỉ trưa",
                  children: <BreakLunch />,
                }}
              />
            </div>

            <div className={styles.collapseContainer}>
              <Collapse
                item={{
                  key: "3",
                  header: "Cài đặt loại hình làm việc",
                  children: <WorkType />,
                }}
              />
            </div>

            <div className={styles.collapseContainer}>
              <Collapse
                item={{
                  key: "4",
                  header: "Cài đặt ngày nghỉ lễ",
                  children: <Holiday />,
                }}
              />
            </div>
          </div>
        </div>    
    </>
  );
}

export default CheckinSetting;