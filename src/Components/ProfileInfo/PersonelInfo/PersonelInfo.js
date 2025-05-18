import React, { useState, useEffect } from 'react';
import { Modal, Spin } from 'antd';
import Collapse from '../../../Shared/Collapse/Collapse';
import WorkInfo from './Section/WorkInfo';
import History from '../../../Shared/History/History';
import FooterBar from '../../Footer/Footer';
import CreatePersonel from '../../Create/CreatePersonel/CreatePersonel';
import { useNavigate } from 'react-router-dom';
import './styles.css';

function PersonelInfoProfile() {
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
          lunchBreak: '1.5 giờ',
          username: '0058',
          password: '12345678',
          avatar: 'https://example.com/avatar.jpg',
          roleGroup: 'Nhân viên',
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
    navigate('/infomation/contract');
  };

  const handleBack = () => {
    navigate('/infomation/personal');
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
      title: 'Cập nhật thông tin công việc',
      source: 'Người dùng',
      date: '10/04/2025',
    },
    {
      title: 'Thay đổi thông tin tài khoản',
      source: 'Người dùng',
      date: '09/04/2025',
    },
    {
      title: 'Thêm thông tin nhân sự',
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
          <Collapse
            item={{
              key: '1',
              header: 'Thông tin công việc',
              children: <WorkInfo {...data} />,
            }}
          />
        </div>

        <div className="right-column">
          <Collapse
            item={{
              key: '3',
              header: 'Lịch sử hoạt động',
              children: <History historyItems={historyItems} />,
            }}
          />
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
          title="Chỉnh sửa thông tin nhân sự"
          open={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
          width={1000}
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        >
          <CreatePersonel
            key={formKey}
            initialData={data}
            onSave={handleSave}
            onCancel={handleModalClose}
            isModalFooter={true}
          />
        </Modal>
      </div>
    </div>
  );
}

export default PersonelInfoProfile;