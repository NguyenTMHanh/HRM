import React, { useState, useEffect } from 'react';
import Collapse from '../../../Shared/Collapse/Collapse';
import WorkInfo from './Section/WorkInfo';
import { useNavigate } from "react-router-dom";
import { Spin } from 'antd';
import History from '../../../Shared/History/History';
import FooterBar from "../../Footer/Footer";
import './styles.css';

function PersonelInfoProfile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/infomation/contract');
  };

  const handleBack = () => {
    navigate('/infomation/personal');
  };

  const handleEdit = () => {
    navigate('/create/personel');
  };
  useEffect(() => {
    const fetchMockData = async () => {
      try {
        setLoading(true);
        const mockData = {
          fullName: 'Nguyễn Thị Mỹ Hạnh',
          gender: 'Nữ',
          dateOfBirth: '01/01/2002',
          joinDate: '03/02/2025',
          department: 'Lập trình',
          jobTitle: 'Nhân viên',
          level: 'Cấp 3',
          position: 'Fresher',
          managedBy: 'Lê Tiến Triển',
          workLocation: 'Prima Solutions',
          workMode: 'Intership',
          lunchBreak: '1.5 giờ'
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
                  header: 'Thông tin công việc',
                  children: <WorkInfo {...data} />,
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
                  key: '2',
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

export default PersonelInfoProfile;
