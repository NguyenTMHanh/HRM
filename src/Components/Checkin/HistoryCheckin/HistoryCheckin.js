import React, { useState, useEffect } from "react";
import CustomTabs from "../../../Shared/Tabs/Tabs";
import { useNavigate, useLocation } from "react-router-dom";
import Collapse from "../../../Shared/Collapse/Collapse";
import WorkStats from "./Section/WorkingTime";
import FooterBar from "../../Footer/Footer";
import ConfirmDlg from "./Section/ConfirmDlg";
import QuestionDlg from "../../SalaryInfo/Section/Dialog/QuestionDlg";
import ChangeTimeRequest from "./Section/ChangeTimeRequest";
import { Spin } from 'antd';
import moment from 'moment';

const HistoryCheckin = () => {
  const [isConfirmDlgOpen, setIsConfirmDlgOpen] = useState(false);
  const [isQuestionDlgVisible, setIsQuestionDlgVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState(moment().format('YYYY'));
  const [selectedMonth, setSelectedMonth] = useState(moment().format('MM'));
  const [workStats, setWorkStats] = useState(null);
  const [checkinData, setCheckinData] = useState([]);
  const [changeTimeRequests, setChangeTimeRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  useEffect(() => {
    const fetchMockData = async () => {
      try {
        setLoading(true);
        const mockWorkStats = {
          totalWorkingDays: 2,
          totalWFHDays: 0,
          totalWorkingHours: 97.4,
          averageWorkingHours: 8.1,
          totalDaysOff: 1,
          totalWeekendOT: 0,
          totalHolidayOT: 0,
        };

        const mockCheckinData = [
          {
            date: '01 – TUE',
            checkInOut: '09:04 – 18:05',
            lunchBreak: '1.5 hrs',
            hours: '7.5 hrs',
            type: 'Office',
            checkFlag: 'WorkDay',
          },
          {
            date: '02 – WED',
            checkInOut: '08:57 – 18:05',
            lunchBreak: '1 hr',
            hours: '8.1 hrs',
            type: 'Office',
            checkFlag: 'WorkDay',
          },
          {
            date: '03 – THU',
            checkInOut: '08:46 – 17:43',
            lunchBreak: '1 hr',
            hours: '7.9 hrs',
            type: 'Office',
            checkFlag: 'WorkDay',
          },
          {
            date: "04 – FRI",
            checkInOut: "08:54 – 18:05",
            lunchBreak: "1 hr",
            hours: "8.2 hrs",
            type: "Office",
            checkFlag: "WorkDay",
          },
          {
            date: '07 – MON',
            checkInOut: '',
            lunchBreak: '',
            hours: '',
            type: '',
            checkFlag: 'Holiday:',
          },
        ];

        const mockChangeTimeRequests = [
          {
            date: '11/04',
            status: 'Confirmed',
            details: {
              workingTime: { old: '09:04 – 18:29', new: '09:04 – 18:05' },
              workingHours: { old: '7.9 hrs', new: '7.5 hrs' },
              lunchBreak: { old: '1.5 hrs', new: '1.5 hrs' },
              workingType: { old: 'Office', new: 'Office' },
              checkFlag: { old: 'WorkDay', new: 'WorkDay' },
              description: 'quên checkout trên công ty, về nhà mới checkout',
            },
          },
          {
            date: '01/04',
            status: 'Pending', // Thay đổi trạng thái thành "Pending"
            details: {
              workingTime: { old: '09:04 – 18:29', new: '09:04 – 18:05' },
              workingHours: { old: '7.9 hrs', new: '7.5 hrs' },
              lunchBreak: { old: '1.5 hrs', new: '1.5 hrs' },
              workingType: { old: 'Office', new: 'Office' },
              checkFlag: { old: 'WorkDay', new: 'WorkDay' },
              description: 'quên checkout trên công ty, về nhà mới checkout',
            },
          },
        ];

        await new Promise((resolve) => setTimeout(resolve, 1000));
        setWorkStats(mockWorkStats);
        setCheckinData(mockCheckinData);
        setChangeTimeRequests(mockChangeTimeRequests);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching mock data:', err);
        setLoading(false);
      }
    };

    fetchMockData();
  }, [selectedYear, selectedMonth]);

  const handleEdit = (updatedData) => {
    setCheckinData((prevData) => {
      const updatedIndex = prevData.findIndex((entry) => entry.date === updatedData.date);
      if (updatedIndex !== -1) {
        const newData = [...prevData];
        newData[updatedIndex] = {
          ...newData[updatedIndex],
          checkInOut: updatedData.checkInOut,
          lunchBreak: updatedData.lunchBreak,
          hours: newData[updatedIndex].hours,
          type: updatedData.type,
          checkFlag: updatedData.checkFlag,
        };
        return newData;
      }
      return prevData;
    });
  };

  const handleConfirm = () => {
    setIsConfirmDlgOpen(true);
  };

  const handleCloseConfirmDlg = () => {
    setIsConfirmDlgOpen(false);
  };

  const handleConfirmSubmit = () => {
    setIsConfirmDlgOpen(false);
  };

  const handleQuestion = () => {
    setIsQuestionDlgVisible(true);
  };

  const handleCloseQuestionDlg = () => {
    setIsQuestionDlgVisible(false);
  };

  const handleSubmitQuestion = () => {
    setIsQuestionDlgVisible(false);
  };
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Spin />
      </div>
    );
  }

  return (
    <div className="table-content-salary">
      <div className="filter-controls">
        <div className="year-month-filter">
          <label htmlFor="year-select">Năm: </label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <label htmlFor="month-select">Tháng: </label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="main-content">
        <div className="left-column">
          <div className="collapse-container">
            <Collapse
              item={{
                key: '1',
                header: 'Thời gian làm việc',
                children: (
                  <WorkStats
                    {...workStats}
                    checkinData={checkinData}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    onEdit={handleEdit}
                  />
                ),
              }}
            />
          </div>
        </div>

        <div className="right-column">
          <div className="collapse-container">
            <Collapse
              item={{
                key: '2',
                header: 'Yêu cầu thay đổi thời gian',
                children: <ChangeTimeRequest requests={changeTimeRequests} />,
              }}
            />
          </div>
        </div>
      </div>

      <FooterBar
        showQuestion={true}
        showConfirm={true}
        onConfirm={handleConfirm}
        onQuestion={handleQuestion}
      />
      <ConfirmDlg
        open={isConfirmDlgOpen}
        onCancel={handleCloseConfirmDlg}
        onConfirm={handleConfirmSubmit}
      />

      <QuestionDlg
        visible={isQuestionDlgVisible}
        onCancel={handleCloseQuestionDlg}
        onOk={handleSubmitQuestion}
      />
    </div>
  );
};

export default HistoryCheckin;