import React, { useState, useEffect } from 'react';
import moment from 'moment';
import BasicSalary from './Section/BasicSalary';
import PersonelInfo from './Section/PersonelInfo';
import ActualSalary from './Section/ActualSalary';
import AllowanceInfo from './Section/Allowance';
import RateInsurance from './Section/RateInsurance';
import TotalIncome from './Section/TotalIncome';
import InsuranceSubSalary from './Section/InsuranceSubSalary';
import Reward from './Section/Reward';
import Punishment from './Section/Punishment';
import DeductionDependent from './Section/DeductionDependent';
import Tax from './Section/Tax';
import NetIncome from './Section/NetIncome';
import Advance from './Section/Advance';
import Collapse from '../../Shared/Collapse/Collapse';
import History from '../../Shared/History/History';
import FooterBar from '../Footer/Footer';
import QuestionDlg from './Section/Dialog/QuestionDlg';
import ConfirmDlg from './Section/Dialog/ConfirmDlg';
import PrintSalary from './Section/Dialog/PrintSalary';
import { Spin, Button, Tooltip } from 'antd';
import AllPayroll from './Section/AllPayroll';
import { useNavigate } from 'react-router-dom';
import './styles.css';

function SalaryInfo() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isQuestionDlgVisible, setIsQuestionDlgVisible] = useState(false);
  const [isConfirmDlgOpen, setIsConfirmDlgOpen] = useState(false);
  const [isPrintSalaryOpen, setIsPrintSalaryOpen] = useState(false);

  const navigate = useNavigate();

  const [selectedYear, setSelectedYear] = useState(moment().format('YYYY'));
  const [selectedMonth, setSelectedMonth] = useState(moment().format('MM'));

  const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  useEffect(() => {
    const fetchMockData = async () => {
      try {
        setLoading(true);
        const mockData = {
          hourlyWage: 50000,
          salaryCoefficient: 2.5,
          standardWorkingDays: 26,
          basicHourlySalary: 45000,
          employeeId: 'NV001',
          fullName: 'Nguyễn Văn A',
          branch: 'Hà Nội',
          department: 'Kỹ thuật',
          position: 'Kỹ sư phần mềm',
          workType: 'Toàn thời gian',
          email: 'nguyenvana@example.com',
          phoneNumber: '0913362717',
          totalActualHours: 160,
          actualHourlySalary: 48000,
          totalAllowance: 6000000,
          totalActualWorkDays: 22,
          totalAllowanceReceived: 5200000,
          totalBonus: 2000000,
          totalPenalty: 1000000,
          totalIncome: 6000000,
          allowances: [
            { name: 'Phụ cấp ăn trưa', amount: 1000000, insuranceContribution: true, taxExempt: false },
            { name: 'Phụ cấp đi lại', amount: 2000000, insuranceContribution: false, taxExempt: true },
            { name: 'Phụ cấp điện thoại', amount: 3000000, insuranceContribution: false, taxExempt: false },
          ],
          rewards: [
            { name: 'Thưởng Tết', amount: 5000000, reason: 'Thành tích xuất sắc năm 2024' },
            { name: 'Thưởng dự án', amount: 3000000, reason: 'Hoàn thành dự án trước thời hạn' },
            { name: 'Thưởng sinh nhật', amount: 1000000, reason: 'Quà sinh nhật nhân viên' },
          ],
          punishments: [
            { name: 'Phạt đi muộn', amount: 500000, reason: 'Đi muộn 5 lần trong tháng' },
            { name: 'Phạt không hoàn thành công việc', amount: 1000000, reason: 'Không đạt KPI' },
          ],
          insuranceRates: [
            { name: 'BHYT', rate: 1.5 },
            { name: 'BHXH', rate: 8 },
            { name: 'BHTN', rate: 1 },
          ],
          dependents: [
            { quantity: 2, amountPerPerson: 4400000 }
          ],
          advances: [
            { name: 'Tạm ứng công tác phí', reason: 'Đi công tác Đà Nẵng', amount: 3000000 },
            { name: 'Tạm ứng mua thiết bị', reason: 'Mua chuột và bàn phím mới', amount: 1500000 }
          ],
          payrolls: [
            {
              month: '04/2025',
              totalIncome: 15000000,
              confirmed: true,
            },
            {
              month: '03/2025',
              confirmed: false,
            },
          ],
          allowanceForInsurance: 1000000,
          insuranceRateTotal: 10.5,
          personalDeduction: 11000000,
          dependentDeduction: 8800000,
          insuranceAmountDeducted: 500000,
          taxExemptAllowance: 2000000,
          taxRate: 5,
          taxAmount: 0,
          netIncome: 10000000,
          year: selectedYear,
          month: selectedMonth,
        };

        await new Promise((resolve) => setTimeout(resolve, 1000));
        setData(mockData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching mock data:', err);
        setLoading(false);
      }
    };

    fetchMockData();
  }, [selectedYear, selectedMonth]);

  const handleQuestion = () => {
    setIsQuestionDlgVisible(true);
  };

  const handleCloseQuestionDlg = () => {
    setIsQuestionDlgVisible(false);
  };

  const handleSubmitQuestion = () => {
    setIsQuestionDlgVisible(false);
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

  const handlePrintSalary = () => {
    setIsPrintSalaryOpen(true);
  };

  const handleClosePrintSalary = () => {
    setIsPrintSalaryOpen(false);
  };

  const handlePrintSalarySubmit = (exportOption, selectedPaySlip) => {
    console.log(`Exporting payslip: ${selectedPaySlip} as ${exportOption}`);
    setIsPrintSalaryOpen(false);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Spin />
      </div>
    );
  }

  const historyItems = [
    {
      title: 'Cập nhật thông tin thưởng',
      source: 'Người dùng',
      date: '14/04/2025',
    },
    {
      title: 'Cập nhật thông tin phụ cấp',
      source: 'Người dùng',
      date: '13/04/2025',
    },
    {
      title: 'Cập nhật lương thực tế',
      source: 'Người dùng',
      date: '12/04/2025',
    },
    {
      title: 'Cập nhật thông tin nhân sự',
      source: 'Người dùng',
      date: '11/04/2025',
    },
    {
      title: 'Cập nhật thông tin lương',
      source: 'Người dùng',
      date: '10/04/2025',
    },
  ];

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

          <Tooltip title="Xuất bảng lương">
            <Button
              onClick={handlePrintSalary}
              style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#ffffff',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                padding: '8px',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#374151"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <path d="M18 14H6v8h12v-8z"></path>
              </svg>
            </Button>
          </Tooltip>
        </div>
      </div>
      <div className="main-content-salary">
        <div className="left-column">
          <div className="collapse-container">
            <Collapse
              item={{
                key: '1',
                header: 'Thông tin nhân sự',
                children: <PersonelInfo {...data} />,
              }}
            />
          </div>
          <div className="collapse-container">
            <Collapse
              item={{
                key: '2',
                header: 'Phụ cấp',
                children: <AllowanceInfo allowances={data.allowances} />,
              }}
            />
          </div>
          <div className="collapse-container">
            <Collapse
              item={{
                key: '3',
                header: 'Tỷ lệ đóng Bảo hiểm',
                children: <RateInsurance insuranceRates={data.insuranceRates} />,
              }}
            />
          </div>
          <div className="collapse-container">
            <Collapse
              item={{
                key: '4',
                header: 'Thưởng',
                children: <Reward rewards={data.rewards} />,
              }}
            />
          </div>
          <div className="collapse-container">
            <Collapse
              item={{
                key: '5',
                header: 'Phạt',
                children: <Punishment punishments={data.punishments} />,
              }}
            />
          </div>
          <div className="collapse-container">
            <Collapse
              item={{
                key: '6',
                header: 'Giảm trừ người phụ thuộc',
                children: <DeductionDependent dependents={data.dependents} />,
              }}
            />
          </div>
          <div className="collapse-container">
            <Collapse
              item={{
                key: '7',
                header: 'Tạm ứng',
                children: <Advance advances={data.advances} />,
              }}
            />
          </div>
          <div className="collapse-container">
            <Collapse
              item={{
                key: '8',
                header: 'Lương cơ bản',
                children: <BasicSalary {...data} />,
              }}
            />
          </div>
          <div className="collapse-container">
            <Collapse
              item={{
                key: '9',
                header: 'Lương thực tế',
                children: <ActualSalary {...data} />,
              }}
            />
          </div>
          <div className="collapse-container">
            <Collapse
              item={{
                key: '10',
                header: 'Tổng thu nhập',
                children: <TotalIncome {...data} />,
              }}
            />
          </div>
          <div className="collapse-container">
            <Collapse
              item={{
                key: '11',
                header: 'Tiền bảo hiểm trừ vào lương',
                children: <InsuranceSubSalary {...data} />,
              }}
            />
          </div>
          <div className="collapse-container">
            <Collapse
              item={{
                key: '12',
                header: 'Thuế TNCN',
                children: <Tax {...data} />,
              }}
            />
          </div>
          <div className="collapse-container">
            <Collapse
              item={{
                key: '13',
                header: 'Thực lĩnh',
                children: <NetIncome {...data} />,
              }}
            />
          </div>
        </div>

        <div className="right-column">
          <div className="collapse-container">
            <Collapse
              item={{
                key: '14',
                header: 'Lịch sử hoạt động',
                children: <History historyItems={historyItems} />,
              }}
            />
          </div>
          <div className="collapse-container" style={{ width: '100%' }}>
            <Collapse
              item={{
                key: '15',
                header: 'Tất cả bảng lương',
                children: <AllPayroll payrolls={data.payrolls} />,
              }}
            />
          </div>
        </div>
      </div>

      <FooterBar
        showQuestion={true}
        showConfirm={true}
        onQuestion={handleQuestion}
        onConfirm={handleConfirm}
      />

      <QuestionDlg
        visible={isQuestionDlgVisible}
        onCancel={handleCloseQuestionDlg}
        onOk={handleSubmitQuestion}
      />

      <ConfirmDlg
        open={isConfirmDlgOpen}
        onCancel={handleCloseConfirmDlg}
        onConfirm={handleConfirmSubmit}
      />

      <PrintSalary
        open={isPrintSalaryOpen}
        onCancel={handleClosePrintSalary}
        onConfirm={handlePrintSalarySubmit}
      />
    </div>
  );
}

export default SalaryInfo;