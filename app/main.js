'use strict';
const electron = require('electron'),
      app = electron.app,
      BrowserWindow = electron.BrowserWindow,
      ipcMain = electron.ipcMain,
      path = require('path'),
      url = require('url');

let win = {};    //声明窗口对象

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', () => {
    createWindow('login', {width:491,height:351,frame:false,resizable:false}, 'login/login.html');
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
    if ('close' === args) win.login.close();    //用户关闭界面
    if ('SUCCESS' === args) {    //登录成功打开主页面并销毁登录界面
        var electronScreen = electron.screen;
        var size = electronScreen.getPrimaryDisplay().workAreaSize;
        createWindow(
            'main',
            {
                width:size.width,
                height:size.height,
                maxWidth:size.width,
                maxHeight:size.height,
                minWidth:600,
                minHeight:600
            },
            'main/main.html'
        );
        win.login.close();
    }
});

//窗口创建函数
function createWindow (name,windowStyle,uri) {
    //创建浏览器窗口。
    windowStyle.show = false;
    win[name] = new BrowserWindow(windowStyle);
    //防止可视闪烁
    win[name].once('ready-to-show', () => {win[name].show()});
    // 加载应用界面
    win[name].loadURL(url.format({
        pathname: path.join(__dirname, uri),
        protocol: 'file:',
        slashes: true
    }));
    //打开开发者工具
    win[name].webContents.openDevTools();
    //当window关闭时取消引用
    win[name].on('closed', () => {win[name] = null;});
}