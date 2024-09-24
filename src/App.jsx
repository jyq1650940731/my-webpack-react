import React, { Suspense, lazy } from "react";
import { Link, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";

const About = lazy(() =>
  import(/* webpackChunkname: 'about' */ "./views/pages/About")
);
const Home = lazy(() =>
  import(/* webpackChunkName: 'home' */ "./views/pages/Home")
);

function App() {
  return (
    <ConfigProvider locale="zhCN">
      <div className="App">
        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/about">ablut</Link>
          </li>
          <li></li>
        </ul>
        <Suspense fallback={<div>loading......</div>}>
          <Routes>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/about" element={<About />}></Route>
          </Routes>
        </Suspense>
      </div>
    </ConfigProvider>
  );
}

export default App;
