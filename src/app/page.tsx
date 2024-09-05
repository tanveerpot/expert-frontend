import React from "react";
import { Button } from "antd";
import LayOut from "./Layout/layout";
import Login from "../app/Login/page";
const userRole: "admin" | "dealer" | "customer" = "dealer";
const App: React.FC = () => (
  <div className="App">
    <Login />
  </div>
);

export default App;
