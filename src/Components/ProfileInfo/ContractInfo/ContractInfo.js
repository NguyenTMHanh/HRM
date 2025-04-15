import React, { useState, useEffect } from 'react';
import Collapse from '../../../Shared/Collapse/Collapse';
import { Spin } from 'antd';
import ContractInfo from './Section/ContractInfo';
import { useNavigate } from "react-router-dom";
import AllowanceInfo from './Section/AllowanceInfo';
import History from '../../../Shared/History/History';
import FooterBar from "../../Footer/Footer";
import './styles.css';


function ContractInfoProfile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
const navigate = useNavigate();

  const handleNext = () => {
    navigate('/infomation/insurance');
  };

  const handleBack = () => {
    navigate('/infomation/personel');
  };

  const handleEdit = () => {
    navigate('/create/contract');
  };
  useEffect(() => {
    const fetchMockData = async () => {
      try {
        setLoading(true);
        const mockData = {
          contractId: 'HDLĐ-2025-001',
          contractType: 'HĐLĐ xác định thời hạn',
          startDate: '03/02/2025',
          endDate: '01/01/2026',
          status: 'Còn hiệu lực',
          hourlyWage: '25 000 VNĐ',
          workHoursPerDay: '8',
          position: 'Nhân viên phát triển phần mềm',
          salaryCoefficient: '1.5',
          standardWorkingDays: '26',
          basicSalary: '7 500 000 VNĐ',
          allowances: [
            { name: 'Phụ cấp ăn trưa', amount: '1 000 000 VNĐ' },
            { name: 'Phụ cấp đi lại', amount: '2 000 000 VNĐ' },
            { name: 'Phụ cấp điện thoại', amount: '3 000 000 VNĐ' }
          ]
        };


        await new Promise((resolve) => setTimeout(resolve, 1000));
        setData(mockData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching mock data:', err);
        setLoading(false);
      }
    };

    fetchMockData();
  }, []);


  const historyItems = [
    {
      title: 'Cập nhật thông tin cá nhân',
      source: 'Người dùng',
      date: '10/04/2025',
    },
    {
      title: 'Thay đổi thông tin liên hệ',
      source: 'Người dùng',
      date: '09/04/2025',
    },
    {
      title: 'Thêm tài khoản ngân hàng',
      source: 'Người dùng',
      date: '08/04/2025',
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Spin />
      </div>
    );
  }


  return (
    <div className="scroll-container">

      <div className="main-content">
        <div className="left-column">
          <div className="collapse-container">
            <div style={{ width: '100%' }}>
              <Collapse
                item={{
                  key: '1',
                  header: 'Thông tin HĐLĐ',
                  children: <ContractInfo {...data} />,
                }}
              />
            </div>
          </div>


          <div className="collapse-container">
            <div style={{ width: '100%' }}>
              <Collapse
                item={{
                  key: '2',
                  header: 'Thông tin phụ cấp',
                  children: <AllowanceInfo {...data} />,
                }}
              />
            </div>
          </div>
        </div>


        <div className="right-column">
          <div className="collapse-container">
            <div style={{ width: '100%' }}>
              <Collapse
                item={{
                  key: '6',
                  header: 'Lịch sử hoạt động',
                  children: <History historyItems={historyItems} />,
                }}
              />
            </div>
          </div>
        </div>

        <FooterBar
          showNext={true}
          onNext={handleNext}
          showEdit={true}
          onEdit={handleEdit}
          showBack={true}
          onBack={handleBack}
        />
      </div>
    </div>
  );
};

export default ContractInfoProfile;
