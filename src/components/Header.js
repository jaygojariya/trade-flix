import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Avatar } from 'antd';
import { UserOutlined, HomeOutlined, LoginOutlined, LogoutOutlined, DashboardOutlined } from '@ant-design/icons';
import { logout } from '../store/authSlice';

const { Header } = Layout;

const AppHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, user, roles } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="logo" style={{ color: 'white', fontSize: '1.5em' }}>
        Trade Flix
      </div>
      <Menu theme="dark" mode="horizontal" selectable={false} style={{ flex: 1, justifyContent: 'flex-start' }}>
        <Menu.Item key="home" icon={<HomeOutlined />}>
          <Link to="/">Home</Link>
        </Menu.Item>
        {roles.includes('admin') && (
          <Menu.Item key="admin" icon={<DashboardOutlined />}>
            <Link to="/admin">Admin Dashboard</Link>
          </Menu.Item>
        )}
      </Menu>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {isLoggedIn ? (
          <>
            <Button type="link" icon={<UserOutlined />} style={{ color: 'white' }}>
              <Link to="/profile">{user.name}</Link>
            </Button>
            <Button type="link" icon={<LogoutOutlined />} onClick={handleLogout} style={{ color: 'white' }}>
              Logout
            </Button>
          </>
        ) : (
          <Button type="link" icon={<LoginOutlined />} style={{ color: 'white' }}>
            <Link to="/login">Login</Link>
          </Button>
        )}
      </div>
    </Header>
  );
};

export default AppHeader;