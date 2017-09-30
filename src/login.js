/**
 * 登录界面js
 * @author yangyunlong
 */
const {ipcRenderer} = window.require('electron');
import React from 'react';
import ReactDOM from 'react-dom';
import {Notice} from './static/UI';
import './static/api';
let account,passwd;
//窗口关闭
document.getElementById('close').onclick = function() {ipcRenderer.send('login-msg','close');}
//登录
document.getElementById('login').onclick = function() {
    account = document.getElementById('account').value.trim();
    passwd = document.getElementById('passwd').value.trim();
    if ('' == account || '' == passwd) return;
    axios.post(api.U('login'), api.data({
        username:account,
        password:passwd
    }))
    .then(function (response) {
        var result = response.data;
        if (!api.verify(result)) {
            //验证错误时，提示登录信息错误
            ReactDOM.render(
                <Notice text={result.status} display={true} top='240px'/>,
                document.getElementById('notice')
            );
            setTimeout(()=>{
                ReactDOM.render(<Notice display={false}/>,document.getElementById('notice'));
            },3000);
        } else {
            localStorage.setItem('token', result.data.token);
            localStorage.setItem('role', result.data.role);
            localStorage.setItem('uid', result.data.uid);          
            ipcRenderer.send('login-msg','SUCCESS');
        }
    });
}

//去除字符串中的空字符；
String.prototype.trim = function () {return this.replace(/(^\s*)|(\s*$)/g,'');};