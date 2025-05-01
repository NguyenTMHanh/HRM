import React from "react";
import styles from "./styles.module.css";
import Collapse from "../../../Shared/Collapse/Collapse";
import SalaryCoefficient from "./Section/SalaryCoeffecient";
import HourlySalary from "./Section/HourlySalary";
import AllowanceSetting from "./Section/AllowanceSetting";
import MinimumWage from "./Section/MinimumWage";
function SalarySetting () {
  return (
    <>
        <div className={styles.collapseWrapper}>
          <div className={styles.scrollContainer}>
            <div className={styles.collapseContainer}>
              <Collapse
                item={{
                  key: "1",
                  header: "Cài đặt hệ số lương theo vị trí",
                  children: <SalaryCoefficient />,
                }}
              />
            </div>

            <div className={styles.collapseContainer}>
              <Collapse
                item={{
                  key: "2",
                  header: "Cài đặt thông số tính lương theo giờ",
                  children: <HourlySalary />,
                }}
              />
            </div>

            <div className={styles.collapseContainer}>
              <Collapse
                item={{
                  key: "3",
                  header: "Cài đặt phụ cấp",
                  children: <AllowanceSetting />,
                }}
              />
            </div>

            <div className={styles.collapseContainer}>
              <Collapse
                item={{
                  key: "4",
                  header: "Cài đặt vùng lương tối thiểu",
                  children: <MinimumWage />,
                }}
              />
            </div>

          </div>
        </div>    
    </>
  );
};

export default SalarySetting;
