import React, { useState } from "react";
import { Segmented } from "antd";
import ProfitLossComponent from "../components/ProfitLossComponent";
import PositionSize from "../components/PositionSize";
import StockAverage from "../components/StockAverage";

const Home = () => {
  const [selectedSegment, setSelectedSegment] = useState("Risk/Reward Ratio");

  const renderContent = () => {
    switch (selectedSegment) {
      case "Risk/Reward Ratio":
        return "Content for Risk/Reward Ratio";
      case "Profit & Loss":
        return <ProfitLossComponent />;
      case "Position Size":
        return <PositionSize />;
      case "Stock Average":
        return <StockAverage />;
      default:
        return "Default Content";
    }
  };

  return (
    <div
      style={{
        padding: 24,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ width: "60%" }}>
        <Segmented
          block
          options={[
            "Risk/Reward Ratio",
            "Profit & Loss",
            "Position Size",
            "Stock Average",
          ]}
          value={selectedSegment}
          onChange={setSelectedSegment}
          style={{ width: "100%" }}
          size="large"
        />
      </div>
      <div style={{ marginTop: 24, width: "60%" }}>{renderContent()}</div>
    </div>
  );
};

export default Home;
