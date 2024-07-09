import React, { useState } from "react";
import { Form, Input, Button, Table, Typography } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { formatNumber } from "../../../helpers/comman";
import AddStock from "./AddStock";

const { Text } = Typography;

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[{ required: true, message: `Please Input ${title}!` }]}
        >
          <Input type={inputType} step="1" />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const StockAverage = () => {
  const [form] = Form.useForm();
  const [entries, setEntries] = useState([]);
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ quantity: "", price: "", ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...entries];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
          quantity: parseFloat(row.quantity),
          price: parseFloat(row.price),
          amount: parseFloat(row.quantity) * parseFloat(row.price),
        });
        setEntries(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleDelete = (key) => {
    setEntries(entries.filter((entry) => entry.key !== key));
  };

  const columns = [
    {
      title: "Quantity",
      dataIndex: "quantity",
      width: "25%",
      editable: true,
      render: (text) => parseFloat(text).toFixed(2),
    },
    {
      title: "Price",
      dataIndex: "price",
      width: "25%",
      editable: true,
      className: "column-text-right",
      render: (text) => parseFloat(text).toFixed(2),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      width: "25%",
      className: "column-text-right",
      render: (_, record) =>
        formatNumber((record.quantity * record.price).toFixed(2)),
    },
    {
      title: "Action",
      dataIndex: "operation",
      width: "20%",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{ marginRight: 8 }}
            >
              Save
            </Typography.Link>
            <Typography.Link onClick={cancel}>Cancel</Typography.Link>
          </span>
        ) : (
          <span>
            <EditOutlined
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
              className="mr-20 fs-20 primary-color"
            />
            <DeleteOutlined
              onClick={() => handleDelete(record.key)}
              className="mr-20 fs-20 red-color"
            />
          </span>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: "number",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const totalQuantity = entries.reduce(
    (sum, entry) => sum + parseFloat(entry.quantity),
    0
  );
  const totalAmount = entries.reduce(
    (sum, entry) => sum + parseFloat(entry.quantity) * parseFloat(entry.price),
    0
  );
  const averagePrice = totalQuantity ? totalAmount / totalQuantity : 0;

  return (
    <div style={{ padding: 24 }}>
      <h2>Stock Average Calculator</h2>
      <AddStock entries={entries} setEntries={setEntries} />
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={entries}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={false}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>
                  <Text strong>
                    Total Quantity: {formatNumber(totalQuantity.toFixed(2))}
                  </Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <Text strong>
                    Average Price: {formatNumber(averagePrice.toFixed(2))}
                  </Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} colSpan={2}>
                  <Text strong>
                    Total Amount: {formatNumber(totalAmount.toFixed(2))}
                  </Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </Form>
    </div>
  );
};

export default StockAverage;
