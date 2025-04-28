import React, { useState } from 'react';
import { Modal, Input } from 'antd';
import FooterBar from '../../../Footer/Footer';
import './styles.css';

const { TextArea } = Input;

const QuestionDlg = ({ visible, onCancel, onOk }) => {
  const [question, setQuestion] = useState('');

  const handleSend = () => {
    onOk(question);
    setQuestion('');
  };

  return (
    <Modal
      title="Thắc mắc phiếu lương"
      open={visible}
      onCancel={onCancel}
      centered={true}
      footer={
        <FooterBar
          onSend={handleSend}
          onCancel={onCancel}
          showSend={true}
          showCancel={true}
          isModalFooter={true} 
        />
      }
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