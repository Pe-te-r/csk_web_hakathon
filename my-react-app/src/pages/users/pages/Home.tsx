import  { useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import '../../../styles/SellerDashboardHomepage.scss'
const salesData = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 5000 },
  { month: "Apr", sales: 7000 },
  { month: "May", sales: 6000 },
];

const ordersData = [
  { month: "Jan", orders: 40 },
  { month: "Feb", orders: 30 },
  { month: "Mar", orders: 50 },
  { month: "Apr", orders: 70 },
  { month: "May", orders: 60 },
];

const SellerDashboard = () => {
  const [totalSales] = useState(25000);
  const [totalOrders] = useState(120);
  const [pendingOrders] = useState(8);
  const [totalProducts] = useState(15);
  const [balance] = useState(18000);

  return (
    <div className="seller-dashboard">
      <h2>Seller Dashboard</h2>
      <div className="dashboard-grid">
        <div className="card">Total Sales: <span>${totalSales}</span></div>
        <div className="card">Total Orders: <span>{totalOrders}</span></div>
        <div className="card">Pending Orders: <span>{pendingOrders}</span></div>
        <div className="card">Total Products: <span>{totalProducts}</span></div>
        <div className="card balance">Available Balance: <span>${balance}</span></div>
      </div>
      
      <div className="charts-container">
        <div className="chart-box">
          <h3>Sales Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#3498db" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Orders Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ordersData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#2ecc71" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;