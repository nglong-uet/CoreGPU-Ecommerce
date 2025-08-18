import SummaryChart from './components/SummaryChart';
import StatCard from './components/StatCard';
import RecentOrder from './components/RecentOrder';
import "./style/AdminDashboard.css";
import { useState, useEffect } from 'react';
import axios from 'axios';
import usePageTitle from '../hooks/usePageTitle';

export default function Dashboard() {
  usePageTitle("Dashboard | CoreGPU");
  
  const [stats, setStats] = useState({
    totalRevenue: 0,
    averageOrderValue: 0,
    newCustomers: 0,
    repeatPurchaseRate: 0
  });

  useEffect(() => {
    axios.get("http://localhost:8080/api/admin/stats")
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="admin-dashboard">
      <div className="top-bar">
        <div className="search-bar">
          <input type="text" placeholder="Tìm kiếm" />
        </div>
      
        <div className="top-bar-actions">
          <button>⏰</button>
          <button>🔔</button>
          <img src="https://i.pravatar.cc/40" alt="User" />
        </div>
      </div>
      
      <div className="main-content">
        <div className="statcard-container">
          <StatCard 
            title="Tổng doanh thu" 
            value={stats.totalRevenue.toLocaleString("vi-VN", { style: "currency", currency: "VND" })} 
            change="+10%" 
            isPositive={true} 
          />

          <StatCard 
            title="Giá trị đơn hàng TB" 
            value={stats.averageOrderValue.toLocaleString("vi-VN", { style: "currency", currency: "VND" })} 
            change="+5%" 
            isPositive={true} 
          />

          <StatCard 
            title="Khách hàng mới" 
            value={stats.newCustomers} 
            change="+3%" 
            isPositive={true} 
          />

          <StatCard 
            title="Tỷ lệ mua hàng lại" 
            value={`${stats.repeatPurchaseRate.toFixed(2)}%`} 
            change="+1%" 
            isPositive={true} 
          />
          <StatCard title="Tỷ lệ đổi hàng" value="32.65%" change="-12.42%" isPositive={false} />
        </div>

        <div className="h-64">
          <SummaryChart />
        </div>

        <div className="h-64">
          <RecentOrder />
        </div>
      </div>
    </div>
  );
}

