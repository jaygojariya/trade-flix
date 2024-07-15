// src/pages/AdminDashboard.js
import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const AdminDashboard = () => {
  return (
    <div>
      <Title level={2}>Admin Dashboard</Title>
      <p>This page is only accessible to users with the 'admin' role.</p>
    </div>
  );
};

export default AdminDashboard;