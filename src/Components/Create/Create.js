import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CustomTabs from "../../Shared/Tabs/Tabs";
import CreateContract from "./CreateContract/CreateContract";
import CreateInsurance from "./CreateInsurance/CreateInsurance";
import CreatePersonal from "./CreatePersonal/CreatePersonal";
import CreatePersonel from "./CreatePersonel/CreatePersonel";
import CreateTax from "./CreateTax/CreateTax";

import "./styles.css";

const Create = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const tabFromUrl = location.pathname.split("/")[2] || "personal";
    
    const items = [
        { key: "personal", label: "Tạo mới Thông tin cá nhân", children: <CreatePersonal /> },
        { key: "personel", label: "Tạo mới Hồ sơ nhân sự", children: <CreatePersonel /> },       
        { key: "contract", label: "Tạo mới Hợp đồng lao động", children: <CreateContract /> },
        { key: "insurance", label: "Tạo mới Bảo hiểm", children: <CreateInsurance /> },
        { key: "tax", label: "Tạo mới Thuế TNCN", children: <CreateTax /> },
    ];

    const handleTabChange = (key) => {
        navigate(`/create/${key}`);
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

export default Create;
