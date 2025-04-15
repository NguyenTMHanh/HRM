import React, { useState, useEffect } from "react";
import CustomTabs from "../../Shared/Tabs/Tabs";
import { useNavigate, useLocation } from "react-router-dom";
import ContractInfo from "./ContractInfo/ContractInfo";
import InsuranceInfo from "./InsuranceInfo/InsuranceInfo";
import PersonalInfo from "./PersonalInfo/PersonalInfo";
import PersonelInfo from "./PersonelInfo/PersonelInfo";
import TaxInfo from "./TaxInfo/TaxInfo";
import "./styles.css";

const HumanResource = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const tabFromUrl = location.pathname.split("/")[2] || "personal";
    
    const items = [
        { key: "personal", label: "Thông tin Cá nhân", children: <PersonalInfo /> },
        { key: "personel", label: "Thông tin Hồ sơ nhân sự", children: <PersonelInfo /> },
        { key: "contract", label: "Thông tin Hợp đồng lao động", children: <ContractInfo /> },
        { key: "insurance", label: "Thông tin Bảo hiểm", children: <InsuranceInfo /> },
        { key: "tax", label: "Thông tin Thuế TNCN", children: <TaxInfo /> },
    ];

    const handleTabChange = (key) => {
        navigate(`/infomation/${key}`);
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

export default HumanResource;
