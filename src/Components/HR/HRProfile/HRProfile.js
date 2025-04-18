import React, { useState, useEffect } from "react";
import CustomTabs from "../../../Shared/Tabs/Tabs";
import HRPersonel from "./Section/HRPersonel";
import HRContract from "./Section/HRContract";
import HRInsurance from "./Section/HRInsurance";
import HRTax from "./Section/HRTax";
import { useNavigate, useLocation } from "react-router-dom";

import "./styles.css";

const ProfileInfo = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const tabFromUrl = location.pathname.split("/")[3] || "personel";
    
    const items = [
        { key: "personel", label: "Danh sách Hồ sơ nhân sự", children: <HRPersonel /> },       
        { key: "contract", label: "Danh sách HDLĐ", children: <HRContract />},
        { key: "insurance", label: "Danh Bảo hiểm", children: <HRInsurance/> },
        { key: "tax", label: "Danh sách Thuế TNCN", children: <HRTax/> },
    ];

    const handleTabChange = (key) => {
        navigate(`/hr/profile/${key}`);
    };

    return (
        <div className="header-tabs">
            <CustomTabs 
                items={items} 
                activeKey={tabFromUrl} 
                onChange={handleTabChange} 
            />
        </div>
    );
};

export default ProfileInfo;
