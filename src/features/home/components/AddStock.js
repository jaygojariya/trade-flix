import { Button, Form, Input } from "antd";
import React from "react";

function AddStock({ entries, setEntries }) {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const newEntry = {
      key: Date.now(),
      quantity: parseFloat(values.quantity),
      price: parseFloat(values.price),
      amount: parseFloat(values.quantity) * parseFloat(values.price),
    };
    setEntries([...entries, newEntry]);
    form.resetFields();
  };

  return (
    <div className="mb-10">
      <Form
        form={form}
        layout="inline"
        onFinish={onFinish}
        style={{ marginTop: 16 }}
      >
        <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
          <Form.Item
            name="quantity"
            rules={[{ required: true }]}
            style={{ flex: 1 }}
          >
            <Input
              type="number"
              step="10"
              min={1}
              placeholder="Quantity"
              style={{
                borderColor: form.getFieldError("quantity").length ? "red" : "",
              }}
            />
          </Form.Item>
          <Form.Item
            name="price"
            rules={[{ required: true }]}
            style={{ flex: 1 }}
          >
            <Input
              type="number"
              step="1"
              min={1}
              placeholder="Entry Price"
              style={{
                borderColor: form.getFieldError("price").length ? "red" : "",
              }}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
}

export default AddStock;
