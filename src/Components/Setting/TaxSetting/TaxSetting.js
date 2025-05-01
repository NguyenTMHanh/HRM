import React from "react";
import Collapse from "../../../Shared/Collapse/Collapse";
import TaxRate from "./Section/TaxRate";
import Deduction from "./Section/Dedution";
import styles from "./styles.module.css";
function TaxSetting () {
  return (
    <>
        <div className={styles.collapseWrapper}>
          <div className={styles.scrollContainer}>
            <div className={styles.collapseContainer}>
              <Collapse
                item={{
                  key: "1",
                  header: "Cài đặt Thuế suất và Lũy tiến",
                  children: <TaxRate />,
                }}
              />
            </div>

            <div className={styles.collapseContainer}>
              <Collapse
                item={{
                  key: "2",
                  header: "Cài đặt các khoản giảm trừ Thuế TNCN",
                  children: <Deduction />,
                }}
              />
            </div>
          </div>
        </div>    
    </>
  );
};

export default TaxSetting;
