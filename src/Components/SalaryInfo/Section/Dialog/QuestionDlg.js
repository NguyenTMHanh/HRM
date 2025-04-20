import React, { useState } from 'react';
import { Modal, Button, Input } from 'antd';
import './styles.css';

const { TextArea } = Input;

const QuestionDlg = ({ visible, onCancel, onOk }) => {
    const [question, setQuestion] = useState('');

    const handleSubmit = () => {
        onOk(question);
        setQuestion('');
    };

    return (
        <Modal
            title="Thắc mắc phiếu lương"
            open={visible} 
            onCancel={onCancel}
            centered={true}
            footer={[
                <Button key="cancel" onClick={onCancel} className="cancel-btn">
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit} className="submit-btn">
                    Gửi
                </Button>,
            ]}
            className="question-dlg"
        >
            <div className="question-content">
                <TextArea
                    rows={4}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Nhập thắc mắc của bạn..."
                    className="question-input"
                />
            </div>
        </Modal>
    );
};

export default QuestionDlg;