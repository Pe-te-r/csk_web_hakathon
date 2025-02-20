import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import '../../../styles/AdminDashboard.scss'

const AdminDashboard: React.FC = () => {
  // Static data for the admin dashboard (can be fetched from an API in real use)
  const [stats] = useState({
    users: 150,
    products: 320,
    categories: 12,
    subcategories: 35,
    orders: 87,
    revenue: 125000, // Static revenue data in Ksh
  });

  // Dynamic data for charts (updates when stats change)
  const categoryData = [
    { name: "Electronics", count: 80 },
    { name: "Clothing", count: 50 },
    { name: "Home", count: 40 },
    { name: "Toys", count: 30 },
    { name: "Books", count: 25 },
    { name: "Accessories", count: 20 },
  ];

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <h2>Admin Dashboard</h2>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card">Users: {stats.users}</div>
        <div className="stat-card">Products: {stats.products}</div>
        <div className="stat-card">Categories: {stats.categories}</div>
        <div className="stat-card">Subcategories: {stats.subcategories}</div>
        <div className="stat-card">Orders: {stats.orders}</div>
        <div className="stat-card revenue">Revenue: Ksh {stats.revenue.toLocaleString()}</div>
      </div>

      {/* Chart Section */}
      <div className="chart-container">
        <h3>Products by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3498db" barSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
