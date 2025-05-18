import React, { useState, useEffect } from 'react';
import { Modal, Spin } from 'antd';
import PersonalInfo from './Section/PersonalInfo';
import Identification from './Section/Identification';
import ResidentInfo from './Section/ResidentInfo';
import ContactInfo from './Section/ContactInfo';
import BankInfo from './Section/BankInfo';
import Collapse from '../../../Shared/Collapse/Collapse';
import History from '../../../Shared/History/History';
import { useNavigate } from 'react-router-dom';
import FooterBar from '../../Footer/Footer';
import CreatePersonal from '../../Create/CreatePersonal/CreatePersonal';
import './styles.css';

function PersonalInfoProfile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formKey, setFormKey] = useState(0); 
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/infomation/personel');
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

  useEffect(() => {
    const fetchMockData = async () => {
      try {
        setLoading(true);
        const mockData = {
          fullName: 'Nguyễn Văn A',
          gender: 'Nam',
          dateOfBirth: '01/01/1990',
          nationality: 'Việt Nam',
          ethnicity: 'Kinh',
          identityNumber: '012345678901',
          issuedDate: '15/03/2010',
          issuedPlace: 'TP. Hồ Chí Minh',
          frontImage: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2021/1/26/874344/Can-Cuoc-Cong-Dan-Ga.jpg',
          backImage: 'https://badontv.vn/uploads/news/2021_03/2701_cccd1-1611715812152.jpg',
          provinceResident: 'Quảng Nam',
          districtResident: 'Đại Lộc',
          wardResident: 'Đại Lãnh',
          houseNumberResident: 'Thôn Tịnh Đông Tây',
          provinceContact: 'Đà Nẵng',
          districtContact: 'Liên Chiểu',
          wardContact: 'Hòa Khánh Bắc',
          houseNumberContact: 'K58/25 Ngô Thì Nhậm',
          phoneNumber: '0913362717',
          email: 'myhanh13022002@gmail.com',
          accountNumber: '5601546004',
          bank: 'BIDV',
          bankBranch: 'Chi nhánh BIDV Hải Vân',
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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Spin />
      </div>
    );
  }

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

  return (
    <div className="scroll-container">
      <div className="main-content">
        <div className="left-column">
          <Collapse
            item={{
              key: '1',
              header: 'Thông tin cá nhân',
              children: <PersonalInfo {...data} />,
            }}
          />
          <Collapse
            item={{
              key: '2',
              header: 'Ảnh chụp CCCD/CMND',
              children: <Identification {...data} />,
            }}
          />
          <Collapse
            item={{
              key: '3',
              header: 'Thông tin thường trú',
              children: <ResidentInfo {...data} />,
            }}
          />
          <Collapse
            item={{
              key: '4',
              header: 'Thông tin liên hệ',
              children: <ContactInfo {...data} />,
            }}
          />
          <Collapse
            item={{
              key: '5',
              header: 'Thông tin tài khoản ngân hàng',
              children: <BankInfo {...data} />,
            }}
          />
        </div>

        <div className="right-column">
          <Collapse
            item={{
              key: '6',
              header: 'Lịch sử hoạt động',
              children: <History historyItems={historyItems} />,
            }}
          />
        </div>
      </div>

      <FooterBar showNext={true} onNext={handleNext} showEdit={true} onEdit={handleEdit} />

      <div style={{ position: 'relative' }}>
        <Modal
          title="Chỉnh sửa thông tin cá nhân"
          open={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
          width={1000}
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        >
          <CreatePersonal
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

export default PersonalInfoProfile;