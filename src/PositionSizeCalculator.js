import React, { useState } from 'react';
import { Form, Input, Button, Typography, Card, Row, Col, Table } from 'antd';

const { Title } = Typography;

const PositionSizeCalculator = () => {
  const [form] = Form.useForm();
  const [calculatedData, setCalculatedData] = useState(null);

  const onFinish = (values) => {
    const quantity = Number(values.quantity);
    const buyPrice = Number(values.buyPrice);
    const sellPrice = Number(values.sellPrice);
    const stopLossPrice = Number(values.stopLossPrice);
    const stopLossPercent = Number(values.stopLossPercent);

    const totalInvestment = quantity * buyPrice;
    const pnlTarget = quantity * (sellPrice - buyPrice);
    const pnlStoplossPrice = quantity * (buyPrice - stopLossPrice);
    const pnlStoplossPercent = (totalInvestment * stopLossPercent) / 100;
    const riskRewardRatio = pnlTarget / pnlStoplossPrice;

    const buyPercent = ((sellPrice - buyPrice) / buyPrice) * 100;

    setCalculatedData({
      totalInvestment,
      buyPrice,
      sellPrice,
      stopLossPrice,
      pnlTarget,
      pnlStoplossPrice,
      pnlStoplossPercent,
      riskRewardRatio,
      buyPercent,
      stopLossPercent,
    });
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Buy (Price)', dataIndex: 'buyPrice', key: 'buyPrice' },
    { title: 'Buy (Percentage)', dataIndex: 'buyPercentage', key: 'buyPercentage' },
    { title: 'Sell (Price)', dataIndex: 'sellPrice', key: 'sellPrice' },
    { title: 'Sell (Percentage)', dataIndex: 'sellPercentage', key: 'sellPercentage' },
  ];

  const data = calculatedData
    ? [
        {
          key: "1",
          name: "Total Investment",
          buyPrice: `₹${calculatedData.totalInvestment.toFixed(2)}`,
          buyPercentage: '',
          sellPrice: `₹${calculatedData.totalInvestment.toFixed(2)}`,
          sellPercentage: '',
        },
        {
          key: "2",
          name: "Buy Price",
          buyPrice: `₹${calculatedData.buyPrice.toFixed(2)}`,
          buyPercentage: '',
          sellPrice: `₹${calculatedData.buyPrice.toFixed(2)}`,
          sellPercentage: '',
        },
        {
          key: "3",
          name: "Sell Price",
          buyPrice: `₹${calculatedData.sellPrice.toFixed(2)}`,
          buyPercentage: `${calculatedData.buyPercent.toFixed(2)}%`,
          sellPrice: `₹${calculatedData.sellPrice.toFixed(2)}`,
          sellPercentage: `${calculatedData.buyPercent.toFixed(2)}%`,
        },
        {
          key: "4",
          name: "Stop Loss Price",
          buyPrice: `₹${calculatedData.stopLossPrice.toFixed(2)}`,
          buyPercentage: `${calculatedData.stopLossPercent.toFixed(2)}%`,
          sellPrice: `₹${calculatedData.stopLossPrice.toFixed(2)}`,
          sellPercentage: `${calculatedData.stopLossPercent.toFixed(2)}%`,
        },
        {
          key: "5",
          name: "P&L (Target)",
          buyPrice: (
            <span style={{ color: 'green' }}>
              ₹{calculatedData.pnlTarget.toFixed(2)}
            </span>
          ),
          buyPercentage: '',
          sellPrice: (
            <span style={{ color: 'green' }}>
              ₹{calculatedData.pnlTarget.toFixed(2)}
            </span>
          ),
          sellPercentage: '',
        },
        {
          key: "6",
          name: "P&L (Stop Loss)",
          buyPrice: (
            <span style={{ color: 'red' }}>
              -₹{calculatedData.pnlStoplossPrice.toFixed(2)}
            </span>
          ),
          buyPercentage: (
            <span style={{ color: 'red' }}>
              -₹{calculatedData.pnlStoplossPercent.toFixed(2)}
            </span>
          ),
          sellPrice: (
            <span style={{ color: 'red' }}>
              -₹{calculatedData.pnlStoplossPrice.toFixed(2)}
            </span>
          ),
          sellPercentage: (
            <span style={{ color: 'red' }}>
              -₹{calculatedData.pnlStoplossPercent.toFixed(2)}
            </span>
          ),
        },
        {
          key: "7",
          name: "Risk Reward Ratio",
          buyPrice: calculatedData.riskRewardRatio.toFixed(2),
          buyPercentage: '',
          sellPrice: calculatedData.riskRewardRatio.toFixed(2),
          sellPercentage: '',
        },
      ]
    : [];

  return (
    <Card title={<Title level={2}>NSE India Position Size Calculator</Title>} style={{ maxWidth: 800, margin: '0 auto' }}>
      <Form form={form} name="positionSizeForm" onFinish={onFinish} layout="vertical">
        <Form.Item name="quantity" label="Quantity" initialValue={100} rules={[{ required: true }]}>
          <Input type="number" min={1} />
        </Form.Item>
        <Form.Item name="buyPrice" label="Buy Price (₹)" initialValue={100} rules={[{ required: true }]}>
          <Input type="number" min={0} />
        </Form.Item>
        <Form.Item name="sellPrice" label="Sell Price (₹)" initialValue={110} rules={[{ required: true }]}>
          <Input type="number" min={0} />
        </Form.Item>
        <Form.Item name="stopLossPrice" label="Stop Loss Price (₹)" rules={[{ required: true }]}>
          <Input type="number" min={0} />
        </Form.Item>
        <Form.Item name="stopLossPercent" label="Stop Loss Percent (%)" rules={[{ required: true }]}>
          <Input type="number" min={0} max={100} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Calculate
          </Button>
        </Form.Item>
      </Form>

      {calculatedData && (
        <div style={{ marginTop: '20px' }}>
          <Title level={4}>Calculated Data:</Title>
          <Table columns={columns} dataSource={data} pagination={false} />
        </div>
      )}
    </Card>
  );
};

export default PositionSizeCalculator;
