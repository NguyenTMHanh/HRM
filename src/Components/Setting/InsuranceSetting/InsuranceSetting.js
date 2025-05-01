import React from "react";
import styles from "./styles.module.css";
import Collapse from "../../../Shared/Collapse/Collapse";
import RateBHYT from "./Section/RateBHYT";
import RateBHXH from "./Section/RateBHXH";
import RateBHTN from "./Section/RateBHTN";
function InsuranceSetting () {
  return (
    <>
        <div className={styles.collapseWrapper}>
          <div className={styles.scrollContainer}>
            <div className={styles.collapseContainer}>
              <Collapse
                item={{
                  key: "1",
                  header: "Cài đặt tỷ lệ đóng BHYT",
                  children: <RateBHYT />,
                }}
              />
            </div>

            <div className={styles.collapseContainer}>
              <Collapse
                item={{
                  key: "2",
                  header: "Cài đặt tỷ lệ đóng BHXH",
                  children: <RateBHXH />,
                }}
              />
            </div>

            <div className={styles.collapseContainer}>
              <Collapse
                item={{
                  key: "3",
                  header: "Cài đặt tỷ lệ đóng BHTN",
                  children: <RateBHTN />,
                }}
              />
            </div>
          </div>
        </div>    
    </>
  );
};

export default InsuranceSetting;
