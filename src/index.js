/*
 * @Author: YourName
 * @Date: 2024-09-24 15:59:01
 * @LastEditTime: 2024-09-24 17:22:35
 * @LastEditors: YourName
 * @Description:
 * @FilePath: \webpack\my-webpack\src\index.ts
 * 版权声明
 */
import React from "react";
import ReactDom from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { reduce } from "./fuyon";
import "./assets/styles/index.css";
import "./assets/styles/cs.scss";
import './assets/styles/celess.less';
import App from "./App";

// const btn = document.createElement("button");
const root = ReactDom.createRoot(document.getElementById("root"));

console.log(reduce(1, 20));
root.render(
  <BrowserRouter>
    <App></App>
  </BrowserRouter>
);
