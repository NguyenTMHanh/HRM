import React, { useState, useEffect } from "react";
import { Input, Button, Row, Col, Select, Form, DatePicker, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import styled from "styled-components";
import moment from "moment";

const DeleteButton = styled(Button)`
  background-color: #f5222d;
  border-color: #f5222d;
  color: white;
  border-radius: 4px;
  padding: 8px 16px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #d42a2a;
    border-color: #d42a2a;
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }
`;

const AddButton = styled(Button)`
  background-color: #001b45;
  border-color: #001b45;
  color: white;
  border-radius: 4px;
  padding: 8px 16px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #002d72 !important;
    border-color: #002d72;
    color: white !important;
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }
`;

// Styled component cho Upload
const StyledUpload = styled(Upload)`
  display: block;

  .ant-upload {
    width: 100% !important;
  }

  .ant-btn {
    width: 100% !important;
    text-align: left;
  }
`;

const Dependent = ({ form }) => {
  const relationshipOptions = [
    { label: "Con", value: "Con" },
    { label: "Cha/Mẹ", value: "Cha/Mẹ" },
    { label: "Vợ/Chồng", value: "Vợ/Chồng" },
    { label: "Khác", value: "Khác" },
  ];

  // State để lưu fileList cho từng mục trong Form.List
  const [fileLists, setFileLists] = useState({});

  // Hàm xử lý sự kiện upload
  const handleUploadChange = (index, info) => {
    const newFileLists = { ...fileLists, [index]: info.fileList };
    setFileLists(newFileLists);
    form.setFieldsValue({
      dependents: form
        .getFieldValue("dependents")
        .map((dep, idx) =>
          idx === index ? { ...dep, proofFile: info.fileList } : dep
        ),
    });
  };

  // Đồng bộ fileLists với Form.List khi fields thay đổi
  useEffect(() => {
    const currentDependents = form.getFieldValue("dependents") || [];
    const newFileLists = {};
    currentDependents.forEach((dep, index) => {
      if (dep && dep.proofFile) {
        newFileLists[index] = dep.proofFile;
      }
    });
    setFileLists(newFileLists);
  }, [form.getFieldValue("dependents")]);

  return (
    <Form.List name="dependents">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }, index) => (
            <Row gutter={[16, 16]} key={key}>
              <Col xs={24} sm={4}>
                <Form.Item
                  {...restField}
                  label="Tình trạng đăng ký"
                  name={[name, "registered"]}
                  rules={[{ required: true, message: "Vui lòng chọn tình trạng!" }]}
                  initialValue="Đã đăng ký"
                >
                  <Select
                    options={[
                      { label: "Đã đăng ký", value: "Đã đăng ký" },
                      { label: "Chưa đăng ký", value: "Chưa đăng ký" },
                    ]}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={3}>
                <Form.Item
                  {...restField}
                  label="Mã số thuế"
                  name={[name, "taxCode"]}
                  rules={[{ pattern: /^[0-9]*$/, message: "Chỉ được nhập số!" }]}
                >
                  <Input placeholder="Nhập mã số thuế (nếu có)" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={3}>
                <Form.Item
                  {...restField}
                  label="Họ và tên"
                  name={[name, "fullName"]}
                  rules={[
                    { required: true, message: "Vui lòng nhập họ tên!" },
                  ]}
                >
                  <Input placeholder="Nhập họ và tên" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={3}>
                <Form.Item
                  {...restField}
                  label="Ngày sinh"
                  name={[name, "birthDate"]}
                  rules={[
                    { required: true, message: "Vui lòng chọn ngày sinh!" },
                    {
                      validator: (_, value) =>
                        value && value.isBefore(moment())
                          ? Promise.resolve()
                          : Promise.reject("Ngày sinh phải là ngày trong quá khứ!"),
                    },
                  ]}
                >
                  <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={3}>
                <Form.Item
                  {...restField}
                  label="Mối quan hệ"
                  name={[name, "relationship"]}
                  rules={[{ required: true, message: "Vui lòng chọn mối quan hệ!" }]}
                >
                  <Select placeholder="Chọn mối quan hệ" options={relationshipOptions} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={6}>
                <Form.Item
                  {...restField}
                  label="Hồ sơ minh chứng"
                  name={[name, "proofFile"]}
                  valuePropName="fileList"
                  rules={[{ required: true, message: "Vui lòng tải lên hồ sơ minh chứng!" }]}
                >
                  <StyledUpload
                    beforeUpload={() => false}
                    showUploadList={false}
                    maxCount={1}
                    fileList={fileLists[index] || []}
                    onChange={(info) => handleUploadChange(index, info)}
                  >
                    <Button icon={<UploadOutlined />}>
                      {(fileLists[index] && fileLists[index].length > 0)
                        ? fileLists[index][0].name
                        : "Tải lên"}
                    </Button>
                  </StyledUpload>
                </Form.Item>
              </Col>

              <Col xs={24} sm={2} style={{ display: "flex", alignItems: "center" }}>
                <DeleteButton onClick={() => remove(name)}>Xóa</DeleteButton>
              </Col>
            </Row>
          ))}

          <Form.Item>
            <AddButton
              onClick={() => {
                add();
                setFileLists((prev) => {
                  const newFileLists = { ...prev };
                  fields.forEach((field, idx) => {
                    if (!newFileLists[idx]) newFileLists[idx] = [];
                  });
                  return newFileLists;
                });
              }}
              block
            >
              Thêm người phụ thuộc
            </AddButton>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};

export default Dependent;