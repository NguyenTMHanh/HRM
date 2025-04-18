import React from 'react';
import { FaFileAlt } from 'react-icons/fa'; 
import './styles.css';

const History = ({ historyItems }) => {
  return (
    <div className="history-list">
      {historyItems.map((item, index) => (
        <div key={index} className="history-item">
          <div className="history-item-content">
            <FaFileAlt className="history-icon" /> 
            <div className="history-text">
              <div className="item-title">{item.title}</div>
              <div className="item-source">
                {item.source} - {item.date}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default History;