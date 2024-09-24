import React from 'react';
import ReactDom from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import {reduce} from './fuyon';
import './assets/styles/index.css';
import './assets/styles/cs.scss';
import App from './App';

const btn = document.createElement("button");
const root = ReactDom.createRoot(document.getElementById('root'));

console.log(reduce(1, 20));
root.render(
    <BrowserRouter>
        <App></App>
    </BrowserRouter>
)

