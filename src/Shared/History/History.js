import React from 'react';
import { FaHistory } from 'react-icons/fa'; // Changed to FaHistory for a more thematic icon
import './styles.css';

const History = ({ historyItems }) => {
  return (
    <div className="history-list">
      {historyItems.map((item, index) => (
        <div key={index} className="history-item">
          <div className="history-item-content">
            <FaHistory className="history-icon" /> {/* Updated icon */}
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