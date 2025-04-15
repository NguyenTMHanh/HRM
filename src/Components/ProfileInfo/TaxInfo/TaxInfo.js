import React, { useState, useEffect } from 'react';
import Collapse from '../../../Shared/Collapse/Collapse';
import TaxInfo from './Section/TaxInfo';
import DependentInfo from './Section/Dependent';
import History from '../../../Shared/History/History';
import FooterBar from "../../Footer/Footer";
import { useNavigate } from "react-router-dom";
import { Spin } from 'antd';
import './styles.css';

function TaxInfoProfile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
const navigate = useNavigate();
  const handleBack = () => {
    navigate('/infomation/insurance');
  };

  const handleEdit = () => {
    navigate('/create/tax');
  };


  useEffect(() => {
    const fetchMockData = async () => {
      try {
        setLoading(true);
        const mockData = {
          hasTax: true,
          taxCode: 'TNCN-123456789',
          dependents: [
            {
              registered: 'Đã đăng ký',
              taxCode: '123456789',
              fullName: 'Nguyễn Văn A',
              birthDate: '2005-06-15',
              relationship: 'Con',
              proofFile: [
                {
                  uid: '-1',
                  name: 'giay-khai-sinh.pdf',
                  status: 'done',
                },
              ],
            },
            {
              registered: 'Chưa đăng ký',
              taxCode: '',
              fullName: 'Trần Thị B',
              birthDate: '1970-12-01',
              relationship: 'Mẹ',
              proofFile: [
                {
                  uid: '-2',
                  name: 'cmnd-me.jpg',
                  status: 'done',
                },
              ],
            },
          ],
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
                  header: 'Thông tin Thuế TNCN',
                  children: <TaxInfo {...data} />,
                }}
              />
            </div>
          </div>

          <div className="collapse-container">
            <div style={{ width: '100%' }}>
              <Collapse
                item={{
                  key: '2',
                  header: 'Thông tin người phụ thuộc',
                  children: <DependentInfo {...data} />,
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
                  key: '3',
                  header: 'Lịch sử hoạt động',
                  children: <History historyItems={historyItems} />,
                }}
              />
            </div>
          </div>
        </div>

        <FooterBar
          showEdit={true}
          onEdit={handleEdit}
          showBack={true}
          onBack={handleBack}
        />
      </div>
    </div>
  );
};

export default TaxInfoProfile;
