import React from 'react';
import TableComponent from '../../../../Shared/Table/Table';
import { useNavigate } from 'react-router-dom';

const HRPersonal = () => {
  const navigate = useNavigate();

  const personalData = [
    {
      id: 'HR001',
      avatar: '/avatar.jpg',
      name: 'Nguyen Van A',
      gender: 'Nam',
      birthDate: '15-05-1990',
      nationality: 'Việt Nam',
      ethnicity: 'Kinh',
      city: 'Hà Nội',
      district: 'Cầu Giấy',
      ward: 'Dịch Vọng',
      houseNumber: '123 Đường Láng',
      contactCity: 'Hà Nội',
      contactDistrict: 'Cầu Giấy',
      contactWard: 'Dịch Vọng',
      contactHouseNumber: '123 Đường Láng',
      email: 'nguyenvana@company.com',
      phoneNumber: '0123456789',
      bankAccount: '1234567890',
      bankName: 'Vietcombank',
    },
    {
      id: 'IT002',
      avatar: '/avatar.jpg',
      name: 'Tran Thi B',
      gender: 'Nữ',
      birthDate: '22-08-1995',
      nationality: 'Việt Nam',
      ethnicity: 'Tày',
      city: 'Hồ Chí Minh',
      district: 'Quận 1',
      ward: 'Bến Nghé',
      houseNumber: '45 Lê Lợi',
      contactCity: 'Hồ Chí Minh',
      contactDistrict: 'Quận 1',
      contactWard: 'Bến Nghé',
      contactHouseNumber: '45 Lê Lợi',
      email: 'tranthib@company.com',
      phoneNumber: '0987654321',
      bankAccount: '9876543210',
      bankName: 'Techcombank',
    },
    {
      id: 'FIN003',
      avatar: '/avatar.jpg',
      name: 'Le Van C',
      gender: 'Nam',
      birthDate: '10-03-1985',
      nationality: 'Việt Nam',
      ethnicity: 'Kinh',
      city: 'Đà Nẵng',
      district: 'Hải Châu',
      ward: 'Hải Châu I',
      houseNumber: '78 Nguyễn Văn Linh',
      contactCity: 'Đà Nẵng',
      contactDistrict: 'Hải Châu',
      contactWard: 'Hải Châu I',
      contactHouseNumber: '78 Nguyễn Văn Linh',
      email: 'levanc@company.com',
      phoneNumber: '0912345678',
      bankAccount: '4567891234',
      bankName: 'MB Bank',
    },
    {
      id: 'MKT004',
      avatar: '/avatar.jpg',
      name: 'Pham Thi D',
      gender: 'Nữ',
      birthDate: '30-11-1992',
      nationality: 'Việt Nam',
      ethnicity: 'Kinh',
      city: 'Hà Nội',
      district: 'Ba Đình',
      ward: 'Đội Cấn',
      houseNumber: '56 Phố Liễu Giai',
      contactCity: 'Hà Nội',
      contactDistrict: 'Ba Đình',
      contactWard: 'Đội Cấn',
      contactHouseNumber: '56 Phố Liễu Giai',
      email: 'phamthid@company.com',
      phoneNumber: '0932145678',
      bankAccount: '3216549870',
      bankName: 'Agribank',
    },
  ].map((item, index) => ({
    ...item,
    stt: index + 1,
  }));

  const columns = [
    { label: 'STT', key: 'stt' },
    {
      label: 'Mã nhân sự',
      key: 'avatar',
      render: (value, item) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={value}
            alt={`${item.name}'s avatar`}
            style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <span>{item.id}</span>
        </div>
      ),
    },
    { label: 'Họ và tên NLĐ', key: 'name' },
    { label: 'Giới tính', key: 'gender' },
    { label: 'Ngày sinh', key: 'birthDate' },
    { label: 'Quốc tịch', key: 'nationality' },
    { label: 'Dân tộc', key: 'ethnicity' },
    { label: 'Tỉnh/Thành phố', key: 'city' },
    { label: 'Quận/Huyện', key: 'district' },
    { label: 'Xã/Phường', key: 'ward' },
    { label: 'Số nhà', key: 'houseNumber' },
    { label: 'Tỉnh/Thành phố (Liên hệ)', key: 'contactCity' },
    { label: 'Quận/Huyện (Liên hệ)', key: 'contactDistrict' },
    { label: 'Xã/Phường (Liên hệ)', key: 'contactWard' },
    { label: 'Số nhà (Liên hệ)', key: 'contactHouseNumber' },
    { label: 'Email', key: 'email' },
    { label: 'Số điện thoại', key: 'phoneNumber' },
    { label: 'Số tài khoản', key: 'bankAccount' },
    { label: 'Ngân hàng', key: 'bankName' },
  ];

  const columnGroups = [
    {
      label: 'Thông tin cá nhân',
      columns: ['stt', 'avatar', 'name', 'gender', 'birthDate', 'nationality', 'ethnicity'],
    },
    {
      label: 'Thông tin nơi trú',
      columns: ['city', 'district', 'ward', 'houseNumber'],
    },
    {
      label: 'Thông tin liên hệ',
      columns: ['contactCity', 'contactDistrict', 'contactWard', 'contactHouseNumber', 'email', 'phoneNumber'],
    },
    {
      label: 'Thông tin ngân hàng',
      columns: ['bankAccount', 'bankName'],
    },
  ];

  const handleEdit = (item) => {
    alert(`Editing personal info of ${item.id}`);
  };

  const handleDelete = (item) => {
    alert(`Deleting personal info of ${item.id}`);
  };

  const filterData = (data, searchTerm) => {
    return data.filter(
      (item) =>
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleCreate = () => {
    navigate('/create/personal');
  };

  return (
    <TableComponent
      data={personalData}
      columns={columns}
      onEdit={handleEdit}
      onDelete={handleDelete}
      filterData={filterData}
      showAdd={false}
      groupBy={columnGroups}
      onCreate={handleCreate}
    />
  );
};

export default HRPersonal;