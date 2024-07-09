import React from "react";
import { ConfigProvider, Layout } from "antd";
import enUS from "antd/locale/en_US";
import themeConfig from "./configs/themeConfig";
import AllRoutes from "./routes/AllRoutes";

function App() {
  return (
    <ConfigProvider locale={enUS} theme={themeConfig}>
      <AllRoutes />
    </ConfigProvider>
  );
}

export default App;
