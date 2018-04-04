'use strict';
const electron = require('electron'),
    app = electron.app,
    BrowserWindow = electron.BrowserWindow,
    ipcMain = electron.ipcMain,
    // axios = require('axios'),
    path = require('path'),
    url = require('url');

let win = {},    //声明窗口对象
    winprints = null,
    param = {},
    timeID = null,
    floder = '',
    download = {total:0,received:0,state:null};


const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
    if (win.main) {
        if (win.main.isMinimized()) win.main.restore()
        win.main.focus()
    } else if (win.login) {
        if (win.login.isMinimized()) win.login.restore()
        win.login.focus()
    }
})
      
if (shouldQuit) {app.quit()}

// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', () => {
    windowModel('login');
    //开发测试优先创建main窗口
    //windowModel('main');
});

app.on('window-all-closed', () => { app.quit() }); //当全部窗口关闭时退出。

/*app.on('activate', () => {
    // 在这文件，你可以续写应用剩下主进程代码。
    // 也可以拆分成几个文件，然后用 require 导入。
    if (win === null) {
        createWindow();
    }
})*/

/* 窗口控制 */
ipcMain.on('minimize-window', (e, name) => {    //最小化
    win[name].minimize();
});
ipcMain.on('maximize-window', (e, name) => {    //最大化
    win[name].maximize();
});
ipcMain.on('unmaximize-window', (e, name) => {    //还原
    win[name].unmaximize();
});
ipcMain.on('close-window', (e, name) => {    //关闭
    win[name].close(); 
});

ipcMain.on('toggle-login', () => {    //切换至登录
    windowModel('login');
    win.main.close();
});
ipcMain.on('toggle-main', () => {    //切换至主界面
    windowModel('main');
    win.login.close();
});
//用户协议
ipcMain.on('protocol', (e, args) => {
    if ('close' === args) {
        win.protocol.close();
    } else {
        windowModel('protocol');
    }
});
ipcMain.on('print-silent', (e, arg, arg2) => {
    if ('object' === typeof arg2) param = arg2;
    if (null === winprints) {
        winprints = new BrowserWindow({show: false});
        //winprints = new BrowserWindow({width:840,height:556,frame:false,resizable:false});
        //winprints.webContents.openDevTools();
        winprints.on('closed', () => { winprints = null; });
    }
    winprints.loadURL(url.format({
        pathname: path.join(__dirname, arg),
        protocol: 'file:',
        slashes: true
    }));
});
ipcMain.on('print', (e, arg) => {
    winprints.webContents.print({silent: true, printBackground: true});
});
ipcMain.on('get-param',(e, args) => {
    e.returnValue = param;
});
ipcMain.on('download', (e, arg) => {
    floder = arg.floder;
    win.main.webContents.downloadURL(arg.url);
    // timeID = setInterval(() => {
    //     e.sender.send('download', download);
    // }, 500);
});
ipcMain.on('cleanInterval', () => {clearInterval(timeID)});
ipcMain.on('notice', (e, url, params) => {
    post(
        url,
        params,
        response => {
            e.sender.send('notice', {
                state:'SUCCESS',
                response:response
            });
        }, 
        error => {
            e.sender.send('notice', {
                state:'FAIL',
                error:error
            });
        }
    );
});
//窗口创建函数
function createWindow(name, windowStyle, uri) {
    //创建浏览器窗口。
    windowStyle.show = false;
    win[name] = new BrowserWindow(windowStyle);
    //防止可视闪烁
    win[name].once('ready-to-show', () => { win[name].show() });
    // 加载应用界面
    win[name].loadURL(url.format({
        pathname: path.join(__dirname, uri),
        protocol: 'file:',
        slashes: true
    }));
    //打开开发者工具
    win[name].webContents.openDevTools();
    //当window关闭时取消引用
    win[name].on('closed', () => {
        win[name] = null;
        if (null !== winprints) {winprints.close();}
    });

    if ('main' == name) {
        win.main.webContents.session.on('will-download', (event, item, webContents) => {
            item.setSavePath(`${floder}\\${item.getFilename()}`);
            item.on('updated', (event, state) => {
              if (state === 'interrupted') {
                //console.log('Download is interrupted but can be resumed')
              } else if (state === 'progressing') {
                if (item.isPaused()) {
                  //console.log('Download is paused')
                } else {
                  //console.log(`Received bytes: ${item.getReceivedBytes()}`)
                  //download = {total:item.getTotalBytes(),received:item.getReceivedBytes(),state:'progressing'};
                }
              }
            })
            item.once('done', (event, state) => {
              if (state === 'completed') {
                //console.log('Download successfully')
                //download = {total:item.getTotalBytes(),received:item.getReceivedBytes(),state:'completed'};
              } else {
                console.log(`Download failed: ${state}`)
              }
            })
        })
    }
}

function windowModel(name) {
    switch (name)
    {
        case 'main':
            ('undefined' === typeof win.main || null === win.main)
            &&
            createWindow(
                'main', 
                {
                    width:1024,
                    height:768,
                    minWidth:800,
                    minHeight:600,
                    frame: false,
                    autoHideMenuBar:true
                },
                //'public/prints/index.html'
                //'public/prints/recharge.html'
                //'public/prints/invoice.html'
                'public/main.html'
                //'public/demo.html'
            );
            break;
        case 'login':
            ('undefined' === typeof win.login || null === win.login)
            &&
            createWindow('login', {width: 491, height: 351, frame: false, resizable: false, autoHideMenuBar:true}, 'public/login.html');
            break;
        case 'protocol':
            ('undefined' === typeof win.protocol || null === win.protocol)
            &&
            createWindow('protocol', {width:840,height:556,frame:false,resizable:false}, 'public/protocol.html');
            break;
    }
}

//数据请求
function post(url, params, success, fail) {
    // axios.post( url, params, {headers: {'Content-Type':'application/x-www-form-urlencoded'}} )
    // .then(response => {'function' === typeof success && success(response)})
    // .catch(error => {'function' === typeof fail && fail(error)});
}