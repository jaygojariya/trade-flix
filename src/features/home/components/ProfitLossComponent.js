import React, { useEffect } from "react";
import { Form, Input, Table, Typography } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { formatNumber } from "../../../helpers/comman";

const { Text } = Typography;

const ProfitLossComponent = () => {
  const [form] = Form.useForm();
  const [profitLossData, setProfitLossData] = React.useState([]);
  const [perShareInfo, setPerShareInfo] = React.useState("");

  const calculateProfitLoss = () => {
    const values = form.getFieldsValue();
    const { quantity, entryPrice, exitPrice } = values;
    const qty = parseFloat(quantity);
    const entry = parseFloat(entryPrice);
    const exit = parseFloat(exitPrice);

    if (!isNaN(qty) && !isNaN(entry) && !isNaN(exit)) {
      const totalInvestment = qty * entry;
      const sellProceeds = qty * exit;
      const profitLoss = sellProceeds - totalInvestment;
      const roi = (profitLoss / totalInvestment) * 100;
      const perShareProfitLoss = exit - entry;

      const newData = {
        key: Date.now(),
        profitAmount: profitLoss > 0 ? formatNumber(profitLoss) : "",
        profit: profitLoss > 0 ? formatNumber(roi) : "",
        lossAmount: profitLoss < 0 ? formatNumber(-profitLoss) : "",
        loss: profitLoss < 0 ? formatNumber(-roi) : "",
      };

      setProfitLossData([newData]);
      setPerShareInfo(
        `Per Share ${
          perShareProfitLoss >= 0 ? "Profit" : "Loss"
        }: ${formatNumber(Math.abs(perShareProfitLoss))}`
      );
    } else {
      setProfitLossData([]);
      setPerShareInfo("");
    }
  };

  useEffect(() => {
    calculateProfitLoss();
  }, []);

  const columns = [
    {
      title: "Profit Amount (ROI %)",
      dataIndex: "profitAmount",
      width: "50%",
      render: (text, record) => (
        <Text
          style={{
            color: "#07bc0c",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          {text} {text ? `(${record.profit}%)` : 0}{" "}
          {text && <ArrowUpOutlined />}
        </Text>
      ),
    },
    {
      title: "Loss Amount (ROI %)",
      dataIndex: "lossAmount",
      width: "50%",
      render: (text, record) => (
        <Text
          style={{
            color: "#e74c3c",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          {text} {text ? `(${record.loss}%)` : 0}{" "}
          {text && <ArrowDownOutlined />}
        </Text>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Profit & Loss Calculator</h2>
      <Form
        form={form}
        layout="vertical"
        style={{ marginBottom: 16 }}
        onValuesChange={calculateProfitLoss}
        initialValues={{
          quantity: 400,
          entryPrice: 1000,
          exitPrice: 1100,
        }}
      >
        <Form.Item
          label="Quantity"
          name="quantity"
          rules={[{ required: true, message: "Please enter quantity!" }]}
        >
          <Input type="number" min={1} placeholder="Enter Quantity" />
        </Form.Item>
        <Form.Item
          label="Entry Price"
          name="entryPrice"
          rules={[{ required: true, message: "Please enter entry price!" }]}
        >
          <Input type="number" min={1} placeholder="Enter Entry Price" />
        </Form.Item>
        <Form.Item
          label="Exit Price"
          name="exitPrice"
          rules={[{ required: true, message: "Please enter exit price!" }]}
        >
          <Input type="number" min={1} placeholder="Enter Exit Price" />
        </Form.Item>
      </Form>
      {perShareInfo && (
        <p style={{ textAlign: "center", fontWeight: "bold" }}>
          {perShareInfo}
        </p>
      )}
      <Table dataSource={profitLossData} columns={columns} pagination={false} />
    </div>
  );
};

export default ProfitLossComponent;
