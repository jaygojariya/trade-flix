import React, { useEffect } from "react";
import { Form, Input, Table, Typography } from "antd";
import { formatNumber } from "../../../helpers/comman";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

const { Text } = Typography;

const PositionSize = () => {
  const [form] = Form.useForm();
  const [positionData, setPositionData] = React.useState([]);
  const [perShareInfo, setPerShareInfo] = React.useState("");

  const calculatePosition = () => {
    const values = form.getFieldsValue();
    const { accountSize, riskPerTrade, entryPrice, stopLoss, targetPrice } =
      values;

    const accountSizeNum = parseFloat(accountSize);
    const riskPerTradeNum = parseFloat(riskPerTrade);
    const entryPriceNum = parseFloat(entryPrice);
    const stopLossNum = parseFloat(stopLoss);
    const targetPriceNum = parseFloat(targetPrice);

    if (
      !isNaN(accountSizeNum) &&
      !isNaN(riskPerTradeNum) &&
      !isNaN(entryPriceNum) &&
      !isNaN(stopLossNum) &&
      !isNaN(targetPriceNum) &&
      targetPriceNum >= entryPriceNum
    ) {
      const riskAmount = (accountSizeNum * riskPerTradeNum) / 100;
      const shareSizeDecimal =
        riskAmount / Math.abs(entryPriceNum - stopLossNum);
      const shareSize = Math.floor(shareSizeDecimal);

      const potentialProfit = shareSize * (targetPriceNum - entryPriceNum);
      const potentialLoss = shareSize * (stopLossNum - entryPriceNum);

      const profitPercent =
        (potentialProfit / (shareSize * entryPriceNum)) * 100;
      const lossPercent =
        (Math.abs(potentialLoss) / (shareSize * entryPriceNum)) * 100;

      const perShareProfitLoss = targetPriceNum - entryPriceNum;
      setPerShareInfo(
        `Per Share ${
          perShareProfitLoss >= 0 ? "Profit" : "Loss"
        }: ${formatNumber(Math.abs(perShareProfitLoss))}`
      );

      const newData = {
        key: 1,
        shares: shareSize,
        profit: potentialProfit,
        profitPercent: profitPercent,
        loss: Math.abs(potentialLoss),
        lossPercent: lossPercent,
      };

      setPositionData([newData]);
    } else {
      setPositionData([]);
      setPerShareInfo("");
    }
  };

  useEffect(() => {
    calculatePosition();
  }, []);

  const columns = [
    {
      title: "No. of Shares",
      dataIndex: "shares",
      key: "shares",
    },
    {
      title: "Profit",
      dataIndex: "profit",
      key: "profit",
      render: (text, record) => (
        <Text
          style={{
            color: "#07bc0c",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          {formatNumber(text)} ({formatNumber(record.profitPercent)}%)
          <ArrowUpOutlined />
        </Text>
      ),
    },
    {
      title: "Loss",
      dataIndex: "loss",
      key: "loss",
      render: (text, record) => (
        <Text
          style={{
            color: "#e74c3c",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          {formatNumber(text)} ({formatNumber(record.lossPercent)}%)
          <ArrowDownOutlined />
        </Text>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Position Size Calculator</h2>
      <Form
        form={form}
        layout="vertical"
        onValuesChange={calculatePosition}
        initialValues={{
          accountSize: 10000,
          riskPerTrade: 1,
          entryPrice: 100,
          stopLoss: 95,
          targetPrice: 110,
        }}
      >
        <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
          <Form.Item
            label="Account Size"
            name="accountSize"
            rules={[{ required: true, message: "Please enter account size!" }]}
            style={{ flex: 1 }}
          >
            <Input type="number" min={1} placeholder="Enter Account Size" />
          </Form.Item>
          <Form.Item
            label="Risk Per Trade %"
            name="riskPerTrade"
            rules={[
              { required: true, message: "Please enter risk per trade!" },
            ]}
            style={{ flex: 1 }}
          >
            <Input type="number" min={1} placeholder="Enter Risk Per Trade %" />
          </Form.Item>
        </div>
        <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
          <Form.Item
            label="Entry Price"
            name="entryPrice"
            rules={[
              { required: true, message: "Please enter entry price!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("entryPrice") <= value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Target Price must be greater than Entry Price")
                  );
                },
              }),
            ]}
            style={{ flex: 1 }}
          >
            <Input type="number" min={1} placeholder="Enter Entry Price" />
          </Form.Item>
          <Form.Item
            label="Stop Loss"
            name="stopLoss"
            rules={[{ required: true, message: "Please enter stop loss!" }]}
            style={{ flex: 1 }}
          >
            <Input type="number" min={1} placeholder="Enter Stop Loss" />
          </Form.Item>
          <Form.Item
            label="Target Price"
            name="targetPrice"
            rules={[
              { required: true, message: "Please enter target price!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("entryPrice") <= value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Target Price must be greater than Entry Price")
                  );
                },
              }),
            ]}
            style={{ flex: 1 }}
          >
            <Input type="number" min={1} placeholder="Enter Target Price" />
          </Form.Item>
        </div>
      </Form>
      {perShareInfo && (
        <p style={{ textAlign: "center", fontWeight: "bold" }}>
          {perShareInfo}
        </p>
      )}
      <Table dataSource={positionData} columns={columns} pagination={false} />
    </div>
  );
};

export default PositionSize;
