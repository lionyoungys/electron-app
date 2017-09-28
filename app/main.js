'use strict';
const {app,BrowserWindow,ipcMain} = require('electron'),path = require('path'),url = require('url');

let win = {};    //声明窗口对象

function createWindow (name,windowStyle) {
    //创建浏览器窗口。
    win[name] = new BrowserWindow(windowStyle);
    //防止可视闪烁
    win[name].once('ready-to-show', () => {win[name].show()});
    // 加载应用界面
    win[name].loadURL(url.format({
        pathname: path.join(__dirname,'login/login.html'),
        protocol: 'file:',
        slashes: true
    }));
    //打开开发者工具
    win[name].webContents.openDevTools();
    //当window关闭时取消引用
    win[name].on('closed', () => {win[name] = null;});
}
// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', () => {
    createWindow('login', {width:491,height:351,frame:false,resizable:false,show:false});
});

app.on('window-all-closed', () => {app.quit()});    //当全部窗口关闭时退出。

/*app.on('activate', () => {
    // 在这文件，你可以续写应用剩下主进程代码。
    // 也可以拆分成几个文件，然后用 require 导入。
    if (win === null) {
        createWindow();
    }
})*/

ipcMain.on('login-msg',(e,args) => {    //登录界面ipc监听
    if ('close' === args) win.login.close();
});
