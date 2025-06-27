import React from 'react';
import DepartmentChart from './AgingChart';
import KPICard from './KPICard';
import WorkingCapitalChart from './WorkingCapitalChart';
import ProfitLossChart from './ProfitLossChart';

const styles = {
  mainContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr',
    height: 'calc(100vh - 70px)',
    margin: '10px',
    gap: '10px',
    overflow: 'hidden',
  },
  chartContainer: {
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    minWidth: 0,
    overflow: 'hiden', // Allow scrolling if content overflows
  },
  
};

const responsiveCSS = `
  @media (max-width: 768px) {
    .dashboard-grid {
      grid-template-columns: 1fr !important;
      grid-template-rows: repeat(4, 1fr) !important;
    }
  }
  @media (max-width: 480px) {
    .dashboard-grid {
      margin: 5px !important;
      gap: 5px !important;
    }
    .chart-container {
      padding: 10px !important;
    }
  }
`;

const Dashboard = () => {
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = responsiveCSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="dashboard-grid" style={styles.mainContainer}>
        <KPICard />
      <div className="chart-container" style={styles.chartContainer}>
        <WorkingCapitalChart />
      </div>
      <div className="chart-container" style={styles.chartContainer}>
        <DepartmentChart />
      </div>
      <div className="chart-container" style={styles.chartContainer}>
        <ProfitLossChart />
      </div>
    </div>
  );
};

export default Dashboard;