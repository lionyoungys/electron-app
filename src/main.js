/**
 * 主界面js
 * @author yangyunlong
 */
import React from 'react';
import ReactDOM from 'react-dom';
import Main,{Header,Index} from './index/index';
const token = localStorage.getItem('token');
ReactDOM.render(<Header/>,document.getElementsByTagName('header')[0]);
ReactDOM.render(<Main token={token}>index</Main>,document.getElementById('main'));