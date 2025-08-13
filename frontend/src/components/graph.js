import React, { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './graph.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const ExpenseGraphs = ({ transactions }) => {
  const [monthlyData, setMonthlyData] = useState({});
  const [categoryData, setCategoryData] = useState({});
  const [trendData, setTrendData] = useState({});
  const [activeTab, setActiveTab] = useState('monthly');

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      processMonthlyData();
      processCategoryData();
      processTrendData();
    }
  }, [transactions]);

  // Process data for monthly comparison
  const processMonthlyData = () => {
    const monthlyExpenses = {};
    const monthlyIncome = {};

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (transaction.transactionType === 'expense') {
        monthlyExpenses[monthYear] = (monthlyExpenses[monthYear] || 0) + transaction.amount;
      } else if (transaction.transactionType === 'credit') {
        monthlyIncome[monthYear] = (monthlyIncome[monthYear] || 0) + transaction.amount;
      }
    });

    // Sort months chronologically
    const sortedMonths = Object.keys(monthlyExpenses).sort((a, b) => {
      const [monthA, yearA] = a.split('/');
      const [monthB, yearB] = b.split('/');
      return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
    });

    setMonthlyData({
      labels: sortedMonths,
      datasets: [
        {
          label: 'Expenses',
          data: sortedMonths.map(month => monthlyExpenses[month] || 0),
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          borderRadius: 8,
          barThickness: 20,
        },
        {
          label: 'Income',
          data: sortedMonths.map(month => monthlyIncome[month] || 0),
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          borderRadius: 8,
          barThickness: 20,
        },
      ],
    });
  };

  // Process data for category breakdown
  const processCategoryData = () => {
    const categoryExpenses = {};
    const categoryIncome = {};

    transactions.forEach(transaction => {
      if (transaction.transactionType === 'expense') {
        categoryExpenses[transaction.category] = (categoryExpenses[transaction.category] || 0) + transaction.amount;
      } else if (transaction.transactionType === 'credit') {
        categoryIncome[transaction.category] = (categoryIncome[transaction.category] || 0) + transaction.amount;
      }
    });

    setCategoryData({
      expense: {
        labels: Object.keys(categoryExpenses),
        datasets: [
          {
            data: Object.values(categoryExpenses),
            backgroundColor: [
              'rgba(255, 99, 132, 0.8)',
              'rgba(54, 162, 235, 0.8)',
              'rgba(255, 206, 86, 0.8)',
              'rgba(75, 192, 192, 0.8)',
              'rgba(153, 102, 255, 0.8)',
              'rgba(255, 159, 64, 0.8)',
              'rgba(138, 201, 38, 0.8)',
              'rgba(106, 76, 147, 0.8)',
              'rgba(25, 130, 196, 0.8)',
              'rgba(244, 91, 105, 0.8)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(138, 201, 38, 1)',
              'rgba(106, 76, 147, 1)',
              'rgba(25, 130, 196, 1)',
              'rgba(244, 91, 105, 1)',
            ],
            borderWidth: 2,
            hoverOffset: 15,
          },
        ],
      },
      income: {
        labels: Object.keys(categoryIncome),
        datasets: [
          {
            data: Object.values(categoryIncome),
            backgroundColor: [
              'rgba(75, 192, 192, 0.8)',
              'rgba(54, 162, 235, 0.8)',
              'rgba(255, 206, 86, 0.8)',
              'rgba(153, 102, 255, 0.8)',
              'rgba(255, 159, 64, 0.8)',
              'rgba(138, 201, 38, 0.8)',
              'rgba(106, 76, 147, 0.8)',
              'rgba(25, 130, 196, 0.8)',
              'rgba(244, 91, 105, 0.8)',
              'rgba(255, 99, 132, 0.8)',
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(138, 201, 38, 1)',
              'rgba(106, 76, 147, 1)',
              'rgba(25, 130, 196, 1)',
              'rgba(244, 91, 105, 1)',
              'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 2,
            hoverOffset: 15,
          },
        ],
      },
    });
  };

  // Process data for expense trend
  const processTrendData = () => {
    // Group transactions by date
    const dailyData = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const dateStr = date.toISOString().split('T')[0];
      
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = { expense: 0, income: 0 };
      }
      
      if (transaction.transactionType === 'expense') {
        dailyData[dateStr].expense += transaction.amount;
      } else if (transaction.transactionType === 'credit') {
        dailyData[dateStr].income += transaction.amount;
      }
    });

    // Sort dates chronologically
    const sortedDates = Object.keys(dailyData).sort();
    
    setTrendData({
      labels: sortedDates,
      datasets: [
        {
          label: 'Daily Expenses',
          data: sortedDates.map(date => dailyData[date].expense),
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 8,
          pointBackgroundColor: 'rgba(255, 99, 132, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        },
        {
          label: 'Daily Income',
          data: sortedDates.map(date => dailyData[date].income),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 8,
          pointBackgroundColor: 'rgba(75, 192, 192, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        },
      ],
    });
  };

  // Chart options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: "'Poppins', sans-serif",
            size: 12,
            weight: 'bold',
          },
          padding: 20,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: 'Monthly Income vs Expenses',
        font: {
          family: "'Poppins', sans-serif",
          size: 16,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          family: "'Poppins', sans-serif",
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          family: "'Poppins', sans-serif",
          size: 13,
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          font: {
            family: "'Poppins', sans-serif",
            size: 11,
          },
          padding: 10,
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          font: {
            family: "'Poppins', sans-serif",
            size: 11,
          },
          padding: 10,
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            family: "'Poppins', sans-serif",
            size: 12,
            weight: 'bold',
          },
          padding: 20,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: 'Category Breakdown',
        font: {
          family: "'Poppins', sans-serif",
          size: 16,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          family: "'Poppins', sans-serif",
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          family: "'Poppins', sans-serif",
          size: 13,
        },
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: "'Poppins', sans-serif",
            size: 12,
            weight: 'bold',
          },
          padding: 20,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: 'Expense & Income Trend',
        font: {
          family: "'Poppins', sans-serif",
          size: 16,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          family: "'Poppins', sans-serif",
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          family: "'Poppins', sans-serif",
          size: 13,
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          font: {
            family: "'Poppins', sans-serif",
            size: 11,
          },
          padding: 10,
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          font: {
            family: "'Poppins', sans-serif",
            size: 11,
          },
          padding: 10,
        },
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <motion.div
      className="graphs-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Container className="mt-4 mb-5">
        <Row className="mb-4">
          <Col>
            <div className="graph-tabs">
              <button 
                className={`tab-btn ${activeTab === 'monthly' ? 'active' : ''}`}
                onClick={() => setActiveTab('monthly')}
              >
                Monthly View
              </button>
              <button 
                className={`tab-btn ${activeTab === 'category' ? 'active' : ''}`}
                onClick={() => setActiveTab('category')}
              >
                Category View
              </button>
              <button 
                className={`tab-btn ${activeTab === 'trend' ? 'active' : ''}`}
                onClick={() => setActiveTab('trend')}
              >
                Trend View
              </button>
            </div>
          </Col>
        </Row>

        {activeTab === 'monthly' && (
          <motion.div variants={itemVariants}>
            <Card className="graph-card">
              <Card.Header className="graph-header">
                <h5 className="mb-0">Monthly Income vs Expenses</h5>
              </Card.Header>
              <Card.Body className="graph-body">
                {Object.keys(monthlyData).length > 0 ? (
                  <div className="chart-container">
                    <Bar data={monthlyData} options={barOptions} />
                  </div>
                ) : (
                  <p className="text-center no-data">No data available for monthly comparison</p>
                )}
              </Card.Body>
            </Card>
          </motion.div>
        )}
        
        {activeTab === 'category' && (
          <Row>
            <Col lg={6} className="mb-4">
              <motion.div variants={itemVariants}>
                <Card className="graph-card">
                  <Card.Header className="graph-header">
                    <h5 className="mb-0">Expense by Category</h5>
                  </Card.Header>
                  <Card.Body className="graph-body">
                    {Object.keys(categoryData).length > 0 && categoryData.expense.labels.length > 0 ? (
                      <div className="chart-container">
                        <Pie data={categoryData.expense} options={pieOptions} />
                      </div>
                    ) : (
                      <p className="text-center no-data">No expense data available</p>
                    )}
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            
            <Col lg={6} className="mb-4">
              <motion.div variants={itemVariants}>
                <Card className="graph-card">
                  <Card.Header className="graph-header">
                    <h5 className="mb-0">Income by Category</h5>
                  </Card.Header>
                  <Card.Body className="graph-body">
                    {Object.keys(categoryData).length > 0 && categoryData.income.labels.length > 0 ? (
                      <div className="chart-container">
                        <Pie data={categoryData.income} options={pieOptions} />
                      </div>
                    ) : (
                      <p className="text-center no-data">No income data available</p>
                    )}
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        )}
        
        {activeTab === 'trend' && (
          <motion.div variants={itemVariants}>
            <Card className="graph-card">
              <Card.Header className="graph-header">
                <h5 className="mb-0">Expense & Income Trend</h5>
              </Card.Header>
              <Card.Body className="graph-body">
                {Object.keys(trendData).length > 0 ? (
                  <div className="chart-container">
                    <Line data={trendData} options={lineOptions} />
                  </div>
                ) : (
                  <p className="text-center no-data">No data available for trend analysis</p>
                )}
              </Card.Body>
            </Card>
          </motion.div>
        )}
      </Container>
    </motion.div>
  );
};

export default ExpenseGraphs; 