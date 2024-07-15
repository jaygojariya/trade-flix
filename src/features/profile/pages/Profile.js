import React, { useEffect, useState } from "react";
import { Card, Avatar, Typography, message, Form, Button, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getQuote, loginAndGetProfile } from "../../../helpers/angelOneApi";
import axios from "axios";
import { getAuth, profileLogin } from "../../../store/authSlice";
import { useDispatch, useSelector } from "react-redux";

const { Title, Text } = Typography;

const Profile = () => {
  const { jwtToken } = useSelector(getAuth)?.auth;

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const data = await getQuote(jwtToken, "SBIN-EQ");
        console.log("🚀 ~ fetchQuote ~ data:", data);
        // setQuote(data.NSE['SBIN-EQ']);
        // setError(null);
      } catch (err) {
        // setError('Failed to fetch quote');
        console.error(err);
      }
    };

    // Fetch immediately
    fetchQuote();

    // Then fetch every minute
    const intervalId = setInterval(fetchQuote, 60000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [jwtToken]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { clientcode, password, totp } = values;
      const profileData = await loginAndGetProfile(clientcode, password, totp);
      console.log("🚀 ~ onFinish ~ profileData:", profileData);
      setProfile(profileData);
      dispatch(
        profileLogin({
          auth: profileData,
        })
      );
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };


  const [message, setMessage] = useState('');

  const chatId = 'AAGoOOogoGMuVQVzKSGjsG3JNqMU-qkBRLY'; // Replace with your actual chat ID

  const sendMessage = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/sendTelegram', { message, chatId });
      console.log('Message sent:', response.data);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };


  return (
    <div>
      <Form
        form={form}
        onFinish={onFinish}
        initialValues={{
          clientcode: "G149281",
          password: "3570",
        }}
      >
        <Form.Item
          name="clientcode"
          rules={[
            { required: true, message: "Please input your client code!" },
          ]}
        >
          <Input placeholder="Client Code" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item
          name="totp"
          rules={[{ required: true, message: "Please input your totp!" }]}
        >
          <Input placeholder="Totp" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Login
          </Button>
        </Form.Item>
      </Form>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message"
      />
      <button onClick={sendMessage}>Send Message</button>
      
      {profile && (
        <Card.Meta
          avatar={<Avatar size={64} icon={<UserOutlined />} />}
          title={<Title level={3}>{profile.name}</Title>}
          description={
            <>
              <Text>Name: {profile.name}</Text>
              <br />
              <Text>Client ID: {profile.clientcode}</Text>
            </>
          }
        />
      )}
    </div>
  );
};

export default Profile;
