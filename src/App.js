import React from "react";
import { ConfigProvider, Layout } from "antd";
import enUS from "antd/locale/en_US";
import themeConfig from "./configs/themeConfig";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AppHeader from "./components/Header";
import { Content } from "antd/es/layout/layout";
import Login from "./features/auth/pages/Login";
import Home from "./features/home/pages/Home";
import Profile from "./features/profile/pages/Profile";
import RoleBasedRoute from "./routes/RoleBasedRoute";
import AdminDashboard from "./features/home/pages/AdminDashboard";
import Unauthorized from "./routes/Unauthorized";
import PublicRoute from "./routes/PublicRoute";

function App() {
  return (
    <ConfigProvider locale={enUS} theme={themeConfig}>
      <Layout>
        <AppHeader />
        <Content style={{ padding: "50px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route
              path="/profile"
              element={
                <RoleBasedRoute allowedRoles={["user", "admin"]}>
                  <Profile />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <RoleBasedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </RoleBasedRoute>
              }
            />
          </Routes>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
