import React, { useState } from 'react';
import AbsenceRequestDlg from './AbsenceRequestDlg'; // Import component mới
import './style.css';

const DailyCheckin = () => {
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [startTime, setStartTime] = useState('-');
  const [endTime, setEndTime] = useState('-');
  const [workingHours, setWorkingHours] = useState('- giờ');
  const [selectedAbsence, setSelectedAbsence] = useState('');
  const [showAbsenceDialog, setShowAbsenceDialog] = useState(false);

  const handleCheckIn = () => {
    if (!checkedIn) {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });
      setStartTime(timeString);
      setCheckedIn(true);
    }
  };

  const handleCheckOut = () => {
    if (checkedIn && !checkedOut) {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });
      setEndTime(timeString);
      setCheckedOut(true);

      // Calculate working hours
      if (startTime !== '-') {
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = timeString.split(':').map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        const diffMinutes = endMinutes - startMinutes;
        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;
        setWorkingHours(`${hours}.${Math.round(minutes / 60 * 100)} hrs`);
      }
    }
  };

  const handleAbsenceSelect = (type) => {
    // Nếu bấm vào DAY-OFF, hiện dialog
    if (type === 'DAY-OFF') {
      setShowAbsenceDialog(true);
      return;
    }

    setSelectedAbsence(type);
    // Reset check-in/out status when selecting absence
    if (type) {
      setCheckedIn(false);
      setCheckedOut(false);
      setStartTime('-');
      setEndTime('-');
      setWorkingHours('- hrs');
    }
  };

  const handleAbsenceDialogClose = () => {
    setShowAbsenceDialog(false);
  };

  return (
    <div className="collapseWrapper">
      <div className="scrollContainer">
        <div className="daily-checkin-container">
          <div className={window.innerWidth <= 768 ? 'daily-checkin-grid responsive' : 'daily-checkin-grid'}>
            {/* Left Column */}
            <div>
              {/* Check in/out Section */}
              <div className="checkin-section">
                <h2 className="section-title">Check-in/out</h2>
                <div className="button-group">
                  <button
                    className={checkedIn ? 'button disabled' : 'button'}
                    onClick={handleCheckIn}
                    disabled={checkedIn}
                    onMouseOver={(e) => {
                      if (!checkedIn) e.target.classList.add('hover');
                    }}
                    onMouseOut={(e) => {
                      if (!checkedIn) e.target.classList.remove('hover');
                    }}
                  >
                    Check - In
                  </button>
                  <button
                    className={!checkedIn || checkedOut ? 'button disabled' : 'button'}
                    onClick={handleCheckOut}
                    disabled={!checkedIn || checkedOut}
                    onMouseOver={(e) => {
                      if (checkedIn && !checkedOut) e.target.classList.add('hover');
                    }}
                    onMouseOut={(e) => {
                      if (checkedIn && !checkedOut) e.target.classList.remove('hover');
                    }}
                  >
                    Check - Out
                  </button>
                </div>
              </div>

              {/* Absence Options Section */}
              <div className="checkin-section">
                <h2 className="section-title">Xin phép</h2>
                <div className="button-group">
                  <button
                    className={selectedAbsence === 'AM-OFF' ? 'button active' : 'button'}
                    onClick={() => handleAbsenceSelect(selectedAbsence === 'AM-OFF' ? '' : 'AM-OFF')}
                    onMouseOver={(e) => {
                      if (selectedAbsence !== 'AM-OFF') e.target.classList.add('hover');
                    }}
                    onMouseOut={(e) => {
                      if (selectedAbsence !== 'AM-OFF') e.target.classList.remove('hover');
                    }}
                  >
                    AM-OFF
                  </button>
                  <button
                    className={selectedAbsence === 'PM-OFF' ? 'button active' : 'button'}
                    onClick={() => handleAbsenceSelect(selectedAbsence === 'PM-OFF' ? '' : 'PM-OFF')}
                    onMouseOver={(e) => {
                      if (selectedAbsence !== 'PM-OFF') e.target.classList.add('hover');
                    }}
                    onMouseOut={(e) => {
                      if (selectedAbsence !== 'PM-OFF') e.target.classList.remove('hover');
                    }}
                  >
                    PM-OFF
                  </button>
                  <button
                    className={selectedAbsence === 'DAY-OFF' ? 'button active' : 'button'}
                    onClick={() => handleAbsenceSelect('DAY-OFF')}
                    onMouseOver={(e) => {
                      if (selectedAbsence !== 'DAY-OFF') e.target.classList.add('hover');
                    }}
                    onMouseOut={(e) => {
                      if (selectedAbsence !== 'DAY-OFF') e.target.classList.remove('hover');
                    }}
                  >
                    DAY-OFF
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Time Section */}
              <div className="checkin-section">
                <h2 className="section-title">Thông tin thời gian</h2>
                <div className="time-grid">
                  <div className="time-section">
                    <h3 className="time-title">Bắt đầu</h3>
                    <p className="time-value">{startTime}</p>
                  </div>
                  <div className="time-section">
                    <h3 className="time-title">Kết thúc</h3>
                    <p className="time-value">{endTime}</p>
                  </div>
                </div>
              </div>

              {/* Working Info Section */}
              <div className="checkin-section">
                <h2 className="section-title">Số giờ làm việc</h2>
                <div className="working-hours-display">
                  <p className="working-hours-value">{workingHours}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Absence Request Dialog */}
        <AbsenceRequestDlg
          open={showAbsenceDialog}
          onCancel={handleAbsenceDialogClose}
          absenceType="DAY-OFF"
        />
      </div>
    </div>
  );
};

export default DailyCheckin;