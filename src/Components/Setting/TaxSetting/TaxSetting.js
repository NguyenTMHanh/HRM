import React from "react";
import Collapse from "../../../Shared/Collapse/Collapse";
import TaxRate from "./Section/TaxRate";
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

            
          </div>
        </div>    
    </>
  );
};

export default TaxSetting;
