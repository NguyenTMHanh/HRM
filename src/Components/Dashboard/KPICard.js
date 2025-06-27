import React from 'react';
import { CheckCircle, Clock, UserX, TrendingUp } from 'lucide-react';

const KPICard = () => {
  const checkInData = {
    onTime: 240,
    late: 12,
    absent: 7,
  };

  const total = checkInData.onTime + checkInData.late + checkInData.absent;
  const onTimePercentage = ((checkInData.onTime / total) * 100).toFixed(1);

  const cardStyle = {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.1)',
    position: 'relative',
    overflow: 'hidden',
    maxWidth: '100%',
  };

  const subHeaderStyle = {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '0.75rem',
    textAlign: 'left',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '6px',
  };

  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '12px',
    marginBottom: '16px',
  };

  const itemStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex', // Change to flex for horizontal layout
    alignItems: 'center', // Center vertically
    gap: '10px', // Space between icon and text
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.2)',
  };

  const iconContainerStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    transition: 'transform 0.3s ease',
  };

  const textContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  const numberStyle = {
    fontSize: '22px',
    fontWeight: '800',
    marginBottom: '4px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: 1,
  };

  const labelStyle = {
    fontSize: '11px',
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const summaryStyle = {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '16px',
    padding: '20px',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
  };

  const summaryTextStyle = {
    color: 'white',
    fontSize: '0.75rem',
    fontWeight: '600',
  };

  const percentageStyle = {
    color: '#4ade80',
    fontSize: '18px',
    fontWeight: '800',
  };

  const backgroundDecoStyle = {
    position: 'absolute',
    top: '-50%',
    right: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
    animation: 'float 6s ease-in-out infinite',
  };

  const keyframes = `
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    .kpi-item:hover {
      transform: translateY(-8px);
      box-shadow: 0 15px 30px rgba(0,0,0,0.15);
    }
    .kpi-item:hover .icon-container {
      transform: scale(1.1);
    }
    .pulse {
      animation: pulse 2s infinite;
    }
  `;

  return (
    <div>
      <style>{keyframes}</style>
      <div style={cardStyle}>
        <div style={backgroundDecoStyle}></div>     
        <div style={subHeaderStyle}>
          <TrendingUp size={20} />
          Tình trạng chấm công
        </div>

        <div style={containerStyle}>
          <div className="kpi-item" style={itemStyle}>
            <div 
              className="icon-container"
              style={{
                ...iconContainerStyle,
                background: 'linear-gradient(135deg, #10b981, #059669)',
                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
              }}
            >
              <CheckCircle size={20} color="white" />
            </div>
            <div style={textContainerStyle}>
              <div style={numberStyle}>{checkInData.onTime}</div>
              <div style={labelStyle}>Đúng giờ</div>
            </div>
          </div>

          <div className="kpi-item" style={itemStyle}>
            <div 
              className="icon-container"
              style={{
                ...iconContainerStyle,
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                boxShadow: '0 8px 32px rgba(245, 158, 11, 0.3)',
              }}
            >
              <Clock size={20} color="white" />
            </div>
            <div style={textContainerStyle}>
              <div style={numberStyle}>{checkInData.late}</div>
              <div style={labelStyle}>Muộn</div>
            </div>
          </div>

          <div className="kpi-item" style={itemStyle}>
            <div 
              className="icon-container"
              style={{
                ...iconContainerStyle,
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3)',
              }}
            >
              <UserX size={20} color="white" />
            </div>
            <div style={textContainerStyle}>
              <div style={numberStyle}>{checkInData.absent}</div>
              <div style={labelStyle}>Vắng</div>
            </div>
          </div>
        </div>

        <div style={summaryStyle}>
          <div style={summaryTextStyle}>Tỷ lệ chấm công</div>
          <div style={percentageStyle} className="pulse">
            {onTimePercentage}% ✨
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPICard;