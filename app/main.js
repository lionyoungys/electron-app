const {app, BrowserWindow,ipcMain} = require('electron');
const path = require('path'),url = require('url');

// 保持一个对于 window 对象的全局引用，如果你不这样做，
// 当 JavaScript 对象被垃圾回收， window 会被自动地关闭

function createWindow () {
    // 创建浏览器窗口。
    win = new BrowserWindow({width:491,height:351,frame:false,resizable:false,show:false})
    win.once('ready-to-show', () => {win.show()})    //防止可视闪烁

    // 加载应用的 index.html。
    win.loadURL(url.format({
        pathname: path.join(__dirname,'login/login.html'),
        protocol: 'file:',
        slashes: true
    }))
    // 打开开发者工具。
    win.webContents.openDevTools()
    // 当 window 被关闭，这个事件会被触发。
    win.on('closed', () => {win = null;})    //dangwindow关闭时取消引用
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow)
// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {app.quit()});

app.on('activate', () => {
    // 在这文件，你可以续写应用剩下主进程代码。
    // 也可以拆分成几个文件，然后用 require 导入。
    if (win === null) {
        createWindow()
    }
})

// 在这文件，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。
ipcMain.on('login-msg',(e,args) => {    //登录界面ipc监听
    if ('close' === args) {
        win.close();
    }
});