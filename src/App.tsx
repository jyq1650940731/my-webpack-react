/*
 * @Author: YourName
 * @Date: 2024-09-24 15:59:01
 * @LastEditTime: 2024-09-25 22:27:27
 * @LastEditors: YourName
 * @Description:
 * @FilePath: \webpack\my-webpack\src\App.tsx
 * 版权声明
 */
import React, { Suspense, lazy } from "react";
import { Link, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import store from "./store";
import { Provider } from "react-redux";
import zhCN from "antd/locale/zh_CN";

const About = lazy(
  () => import(/* webpackChunkname: 'about' */ "./views/pages/About")
);
const Home = lazy(
  () => import(/* webpackChunkName: 'home' */ "./views/pages/Home")
);
const Counter = lazy(
  () => import(/* webpackChunkName: 'home' */ "./views/pages/Counter")
);

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Provider store={store}>
      <div className="App">
        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/about">ablut</Link>
          </li>
          <li>
            <Link to='/counter'>counter</Link>
          </li>
        </ul>
        <Suspense fallback={<div>loading......</div>}>
          <Routes>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/about" element={<About />}></Route>
            <Route path="/counter" element={<Counter />}></Route>
          </Routes>
        </Suspense>
      </div>
      </Provider>
    </ConfigProvider>
  );
}

export default App;
