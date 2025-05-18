import React, { useState, useEffect } from 'react';
import { Modal, Spin } from 'antd';
import Collapse from '../../../Shared/Collapse/Collapse';
import BHYTInfo from './Section/BHYTInfo';
import BHXHInfo from './Section/BHXHInfo';
import BHTNInfo from './Section/BHTNInfo';
import GeneralInfo from './Section/GeneralInfo';
import History from '../../../Shared/History/History';
import FooterBar from '../../Footer/Footer';
import CreateInsurance from '../../Create/CreateInsurance/CreateInsurance';
import { useNavigate } from 'react-router-dom';
import './styles.css';

function InsuranceInfoProfile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMockData = async () => {
      try {
        setLoading(true);
        const mockData = {
          bhytCode: 'DN-4-01 1234567890123',
          bhytRate: '1% NLĐ / 17% DN',
          registeredHospital: 'Bệnh viện Đà Nẵng',
          bhytStartDate: '3/2/2025',
          hasJoined: false,
          bhxhCode: '1234567890123',
          bhxhRate: '1% NLĐ / 17% DN',
          bhxhStartDate: '3/2/2025',
          bhtnRate: '1% NLĐ / 17% DN',
          bhtnStartDate: '3/2/2025',
          bhStatus: 'Đang tham gia',
          bhEndDate: '1/1/2026',
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

  const handleNext = () => {
    navigate('/infomation/tax');
  };

  const handleBack = () => {
    navigate('/infomation/contract');
  };

  const handleEdit = () => {
    setIsModalVisible(true);
    setFormKey(prev => prev + 1);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleSave = (updatedData) => {
    if (updatedData) {
      setData(updatedData);
    }
    setIsModalVisible(false);
  };

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
                  header: 'Thông tin BHYT',
                  children: <BHYTInfo {...data} />,
                }}
              />
            </div>
          </div>

          <div className="collapse-container">
            <div style={{ width: '100%' }}>
              <Collapse
                item={{
                  key: '2',
                  header: 'Thông tin BHXH',
                  children: <BHXHInfo {...data} />,
                }}
              />
            </div>
          </div>

          <div className="collapse-container">
            <div style={{ width: '100%' }}>
              <Collapse
                item={{
                  key: '3',
                  header: 'Thông tin BHTN',
                  children: <BHTNInfo {...data} />,
                }}
              />
            </div>
          </div>

          <div className="collapse-container">
            <div style={{ width: '100%' }}>
              <Collapse
                item={{
                  key: '4',
                  header: 'Thông tin BH chung',
                  children: <GeneralInfo {...data} />,
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
      </div>

      <FooterBar
        showNext={true}
        onNext={handleNext}
        showBack={true}
        onBack={handleBack}
        showEdit={true}
        onEdit={handleEdit}
      />

      <div style={{ position: 'relative' }}>
        <Modal
          title="Chỉnh sửa thông tin bảo hiểm"
          open={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
          width={1000}
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        >
          <CreateInsurance
            key={formKey}
            initialData={data}
            onSave={handleSave}
            isModalFooter={true}
          />
        </Modal>
      </div>
    </div>
  );
}

export default InsuranceInfoProfile;