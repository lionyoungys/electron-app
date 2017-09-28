import React from 'react';
import ReactDOM from 'react-dom';
import {Notice} from '../src/UI';
const {ipcRenderer} = window.require('electron');

document.getElementById('close').onclick = function() {  
    //ipcRenderer.sendSync('login-msg','close');
    //console.log(Notice);
}

document.getElementById('login').onclick = function() {
    ReactDOM.render(
        <Notice text="用户名或密码错误" display='inline-block' top='240px'/>,
        document.getElementById('notice')
    );
    setTimeout(()=>{
        ReactDOM.render(<Notice display="none"/>,document.getElementById('notice'));
    },3000);
}