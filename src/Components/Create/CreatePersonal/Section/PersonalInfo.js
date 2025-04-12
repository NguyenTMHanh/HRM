import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
} from 'antd';

// Xóa import Option không cần thiết
const PersonalInfo = () => {
  const [countries, setCountries] = useState([]);
  const [nations, setNations] = useState([]);
  const [isVietnam, setIsVietnam] = useState(false);

  const countryMap = {
    "Japan": "Nhật Bản",
    "United States": "Mỹ",
    "Vietnam": "Việt Nam",
    "Germany": "Đức",
    "France": "Pháp",
    "United Kingdom": "Vương quốc Anh",
    "China": "Trung Quốc",
    "Russia": "Nga",
  };

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        const countryList = response.data.map(country => ({
          value: country.name.common,
          label: countryMap[country.name.common] || country.name.common,
        }));

        const sortedCountries = countryList.sort((a, b) => a.label.localeCompare(b.label));

        setCountries(sortedCountries);
      })
      .catch(error => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  const option_nation = [
    { value: 'Kinh', label: 'Kinh', key: 'Kinh' },
    { value: "H'Mông", label: "H'Mông", key: "H'Mông" },
    { value: 'Nùng', label: 'Nùng', key: 'Nùng' },
    { value: 'Tày', label: 'Tày', key: 'Tày' },
    { value: 'Mường', label: 'Mường', key: 'Mường' },
    { value: 'Hoa', label: 'Hoa', key: 'Hoa' },
    { value: 'Ê Đê', label: 'Ê Đê', key: 'Ê Đê' },
    { value: 'Chăm', label: 'Chăm', key: 'Chăm' },
    { value: 'Khmer', label: 'Khmer', key: 'Khmer' },
    { value: 'Thái', label: 'Thái', key: 'Thái' },
    { value: 'Dao', label: 'Dao', key: 'Dao' },
    { value: 'Gia Rai', label: 'Gia Rai', key: 'Gia Rai' },
    { value: 'Ba Na', label: 'Ba Na', key: 'Ba Na' },
    { value: 'Xơ Đăng', label: 'Xơ Đăng', key: 'Xơ Đăng' },
    { value: 'Sán Chay', label: 'Sán Chay', key: 'Sán Chay' },
    { value: 'Cơ Ho', label: 'Cơ Ho', key: 'Cơ Ho' },
    { value: 'Châu Ro', label: 'Châu Ro', key: 'Châu Ro' },
    { value: 'Hơ Rê', label: 'Hơ Rê', key: 'Hơ Rê' },
    { value: 'Ra Glai', label: 'Ra Glai', key: 'Ra Glai' },
    { value: 'Mnông', label: 'Mnông', key: 'Mnông' },
    { value: 'XTiêng', label: 'XTiêng', key: 'XTiêng' },
    { value: 'Bru - Vân Kiều', label: 'Bru - Vân Kiều', key: 'Bru - Vân Kiều' },
    { value: 'Thổ', label: 'Thổ', key: 'Thổ' },
    { value: 'Giáy', label: 'Giáy', key: 'Giáy' },
    { value: 'Cơ Tu', label: 'Cơ Tu', key: 'Cơ Tu' },
    { value: 'Gié Triêng', label: 'Gié Triêng', key: 'Gié Triêng' },
    { value: 'Mạ', label: 'Mạ', key: 'Mạ' },
    { value: 'Khơ Mú', label: 'Khơ Mú', key: 'Khơ Mú' },
    { value: 'Co', label: 'Co', key: 'Co' },
    { value: 'Tà Ôi', label: 'Tà Ôi', key: 'Tà Ôi' },
    { value: 'Chơ Ro', label: 'Chơ Ro', key: 'Chơ Ro' },
    { value: 'Kháng', label: 'Kháng', key: 'Kháng' },
    { value: 'Lự', label: 'Lự', key: 'Lự' },
    { value: 'Phù Lá', label: 'Phù Lá', key: 'Phù Lá' },
    { value: 'La Ha', label: 'La Ha', key: 'La Ha' },
    { value: 'Pa Dí', label: 'Pa Dí', key: 'Pa Dí' },
    { value: 'Cống', label: 'Cống', key: 'Cống' },
    { value: 'Brâu', label: 'Brâu', key: 'Brâu' },
    { value: 'Ơ Đu', label: 'Ơ Đu', key: 'Ơ Đu' },
    { value: 'Rơ Măm', label: 'Rơ Măm', key: 'Rơ Măm' },
    { value: 'Pu Péo', label: 'Pu Péo', key: 'Pu Péo' },
    { value: 'Bố Y', label: 'Bố Y', key: 'Bố Y' },
    { value: 'La Hủ', label: 'La Hủ', key: 'La Hủ' },
    { value: 'Lô Lô', label: 'Lô Lô', key: 'Lô Lô' },
    { value: 'Chứt', label: 'Chứt', key: 'Chứt' },
    { value: 'Mảng', label: 'Mảng', key: 'Mảng' },
    { value: 'Pà Thẻn', label: 'Pà Thẻn', key: 'Pà Thẻn' },
    { value: 'Lào', label: 'Lào', key: 'Lào' },
    { value: 'Chà Và', label: 'Chà Và', key: 'Chà Và' },
    { value: 'Ngái', label: 'Ngái', key: 'Ngái' },
    { value: 'Sán Dìu', label: 'Sán Dìu', key: 'Sán Dìu' },
    { value: 'Si La', label: 'Si La', key: 'Si La' },
    { value: 'Cơ Lao', label: 'Cơ Lao', key: 'Cơ Lao' },
    { value: 'Brau', label: 'Brau', key: 'Brau' },
  ];

  const handleNationalityChange = (value) => {
    setIsVietnam(value === "Vietnam");
  };

  const validateIdentityNumber = (_, value) => {
    if (!value) return Promise.reject('Vui lòng nhập CCCD/CMND');
    const regex = /^\d{9}(\d{3})?$/;
    if (!regex.test(value)) {
      return Promise.reject('CMND/CCCD phải chỉ chứa số và có độ dài 9 hoặc 12 ký tự');
    }
    return Promise.resolve();
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
          >
            <Input placeholder="Nguyễn Văn A" style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        <Col xs={24} sm={6}>
          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
          >
            <Select placeholder="Chọn giới tính" style={{ width: '100%' }}>
              <Select.Option value="Male">Nam</Select.Option>
              <Select.Option value="Female">Nữ</Select.Option>
              <Select.Option value="Other">Khác</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={6}>
          <Form.Item
            label="Ngày sinh"
            name="dateOfBirth"
            rules={[{ required: true, message: 'Vui lòng nhập ngày sinh!' }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} placeholder="Chọn ngày sinh"/>
          </Form.Item>
        </Col>

        <Col xs={24} sm={6}>
          <Form.Item
            label="Quốc tịch"
            name="nationality"
          >
            <Select
              showSearch
              placeholder="Chọn quốc tịch"
              style={{ width: '100%' }}
              onChange={handleNationalityChange}
              filterOption={(input, option) =>
                option.children.toLowerCase().startsWith(input.toLowerCase())
              }
            >
              {countries.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={6}>
          <Form.Item
            label="Dân tộc"
            name="ethnicity"
          >
            {isVietnam ? (
              <Select
                showSearch
                placeholder="Chọn dân tộc"
                style={{ width: '100%' }}
                filterOption={(input, option) =>
                  option.children.toLowerCase().startsWith(input.toLowerCase())
                }
              >
                {option_nation.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            ) : (
              <Input placeholder="Nhập dân tộc" />
            )}
          </Form.Item>
        </Col>

        <Col xs={24} sm={6}>
          <Form.Item
            label="CMND/CCCD/Hộ chiếu"
            name="identityNumber"
            rules={[{ validator: validateIdentityNumber }, { required: true }]}
          >
            <Input placeholder="Nhập CMND/CCCD/Hộ chiếu" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={6}>
          <Form.Item
            label="Ngày cấp"
            name="issuedDate"
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} placeholder="Chọn ngày cấp"/>
          </Form.Item>
        </Col>

        <Col xs={24} sm={6}>
          <Form.Item
            label="Nơi cấp"
            name="issuedPlace"
          >
            <Input placeholder="Nhập nơi cấp" />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default PersonalInfo;