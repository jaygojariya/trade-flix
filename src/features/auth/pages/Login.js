// src/pages/Login.js
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Select, message, Card, Typography, Row, Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login } from '../../../store/authSlice';

const { Option } = Select;
const { Title } = Typography;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const onFinish = (values) => {
    // Simulate API call
    setTimeout(() => {
      dispatch(login({
        user: {
          id: '123',
          name: values.username,
          email: `${values.username}@example.com`,
        },
        roles: [values.role],
      }));
      message.success('Login successful');
      const from = location.state?.from?.pathname || '/profile';
      navigate(from, { replace: true });
    }, 1000);
  };

  return (
    <Row justify="center" align="middle" >
      <Col xs={22} sm={16} md={12} lg={8} xl={6}>
        <Card>
          <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>Login</Title>
          <Form
            name="normal_login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your Username!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item
              name="role"
              rules={[{ required: true, message: 'Please select a role!' }]}
            >
              <Select placeholder="Select a role">
                <Option value="user">User</Option>
                <Option value="admin">Admin</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;