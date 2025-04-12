import React from 'react';
import { Form, Input, Row, Col } from 'antd';

const Bank = () => {
    return (
        <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
                <Form.Item
                    label="Số tài khoản"
                    name="accountNumber"
                    rules={[
                        { required: true, message: 'Vui lòng nhập số tài khoản' },
                        { pattern: /^\d+$/, message: 'Số tài khoản chỉ chứa số' }
                    ]}
                >
                    <Input placeholder="Nhập số tài khoản" />
                </Form.Item>
            </Col>

            <Col xs={24} sm={8}>
                <Form.Item 
                    label="Ngân hàng" 
                    name="bank" 
                    rules={[{ required: true, message: 'Vui lòng nhập tên ngân hàng' }]}
                >
                    <Input placeholder="Nhập tên ngân hàng" />
                </Form.Item>
            </Col>

            <Col xs={24} sm={8}>
                <Form.Item 
                    label="Chi nhánh" 
                    name="bankBranch" 
                    rules={[{ required: true, message: 'Vui lòng nhập chi nhánh' }]}
                >
                    <Input placeholder="Nhập chi nhánh ngân hàng" />
                </Form.Item>
            </Col>
        </Row>
    );
};

export default Bank;
