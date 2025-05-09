import React, { useState } from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './Components/SideBar/SideBar';
import HeaderBar from './Components/Header/Header';
import Login from './Components/Auth/Login';
import Dashboard from './Components/Dashboard/Dashboad';
import DailyCheckin from './Components/Checkin/DailyCheckin/DailyCheckin';
import HistoryCheckin from './Components/Checkin/HistoryCheckin/HistoryCheckin';
import CreateContract from './Components/Create/CreateContract/CreateContract';
import CreateInsurance from './Components/Create/CreateInsurance/CreateInsurance';
import CreatePersonal from './Components/Create/CreatePersonal/CreatePersonal';
import CreatePersonel from './Components/Create/CreatePersonel/CreatePersonel';
import CreateTax from './Components/Create/CreateTax/CreateTax';
import HRProfile from './Components/HR/HRProfile/HRProfile';
import HRSalary from './Components/HR/HRSalary/HRSalary';
import HRHistoryCheckin from './Components/HR/HRHistoryCheckin/HRHistoryCheckin';
import PersonalInfo from './Components/ProfileInfo/PersonalInfo/PersonalInfo';
import PersonelInfo from './Components/ProfileInfo/PersonelInfo/PersonelInfo';
import InsuranceInfo from './Components/ProfileInfo/InsuranceInfo/InsuranceInfo';
import ContractInfo from './Components/ProfileInfo/ContractInfo/ContractInfo';
import TaxInfo from './Components/ProfileInfo/TaxInfo/TaxInfo';
import SalaryInfo from './Components/SalaryInfo/SalaryInfo';
import YourLetter from './Components/Letter/YourLetter/YourLetter';
import ApprovedLetter from './Components/Letter/ApprovedLetter/AprovedLetter';
import StructureSetting from './Components/Setting/StructureSetting/StructureSetting';
import CheckinSetting from './Components/Setting/CheckinSetting/CheckinSetting';
import SalarySetting from './Components/Setting/SalarySetting/SalarySetting';
import ContractSetting from './Components/Setting/ContractSetting/ContractSetting';
import TaxSetting from './Components/Setting/TaxSetting/TaxSetting';
import InsuranceSetting from './Components/Setting/InsuranceSetting/InsuranceSetting';
import DetailPermision from './Components/Permission/DetailPermission/DetailPermisstion';
import RolePermission from './Components/Permission/RolePermission/RolePermission';
import Create from './Components/Create/Create';
import HumanResource from './Components/ProfileInfo/ProfileInfo';
import HRPersonel from './Components/HR/HRProfile/Section/HRPersonel';
import HRContract from './Components/HR/HRProfile/Section/HRContract';
import HRInsurance from './Components/HR/HRProfile/Section/HRInsurance';
import HRTax from './Components/HR/HRProfile/Section/HRTax';
import Branch from './Components/Setting/StructureSetting/Page/Branch/Branch';
import StructureView from './Components/Setting/StructureSetting/Page/StructureView/StructureView';
import Rank from './Components/Setting/StructureSetting/Page/Rank/Rank';
import Department from './Components/Setting/StructureSetting/Page/Department/Department';
import JobTitle from './Components/Setting/StructureSetting/Page/JobTitle/JobTitle';
import Position from './Components/Setting/StructureSetting/Page/Position/Position';
function App() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar collapsed={collapsed} />
        <Layout>
          <HeaderBar collapsed={collapsed} toggleCollapse={toggleCollapse} />
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/checkin/daily" element={<DailyCheckin />} />
            <Route path="/checkin/history" element={<HistoryCheckin />} />
            <Route path="/hr/profile" element={<HRProfile />}>
              <Route path="personel" element={<HRPersonel/>} />
              <Route path="insurance" element={<HRInsurance/>} />
              <Route path="contract" element={<HRContract />} />
              <Route path="tax" element={<HRTax />} />
            </Route>

            <Route path="/hr/salary" element={<HRSalary />} />
            <Route path="/hr/checkin/history" element={<HRHistoryCheckin />} />
            <Route path="/infomation" element={<HumanResource />} >
              <Route path="personal" element={<PersonalInfo />} />
              <Route path="personel" element={<PersonelInfo />} />
              <Route path="insurance" element={<InsuranceInfo />} />
              <Route path="contract" element={<ContractInfo />} />
              <Route path="tax" element={<TaxInfo />} />
            </Route>
            <Route path="/salary" element={<SalaryInfo />} />
            <Route path="/letter/sent" element={<YourLetter />} />
            <Route path="/letter/approved" element={<ApprovedLetter />} />
            <Route path="/setting/checkin" element={<CheckinSetting />} />
            <Route path="/setting/insurance" element={<InsuranceSetting />} />
            <Route path="/setting/contract" element={<ContractSetting />} />
            <Route path="/setting/structure" element={<StructureSetting />}>
              <Route path="rank" element={<Rank />} />
              <Route path="branch" element={<Branch />} />
              <Route path="department" element={<Department />} />
              <Route path="jobtitle" element={<JobTitle />} />
              <Route path="position" element={<Position />} />
              <Route path="view" element={<StructureView />} />
            </Route>
            <Route path="/setting/tax" element={<TaxSetting />} />
            <Route path="/setting/salary" element={<SalarySetting />} />
            <Route path="/permission/role" element={<RolePermission />} />
            <Route path="/permission/detail" element={<DetailPermision />} />
            <Route path="/create" element={<Create />} >
              <Route path="personal" element={<CreatePersonal />} />
              <Route path="personel" element={<CreatePersonel />} />
              <Route path="insurance" element={<CreateInsurance />} />
              <Route path="contract" element={<CreateContract />} />
              <Route path="tax" element={<CreateTax />} />
            </Route>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;