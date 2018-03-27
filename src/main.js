/**
 * demo界面组件
 * @author yangyunlong
 */

const {ipcRenderer} = window.require('electron');
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {menu, router, view} from './router';
import './tool';
import './api';    //注册全局api对象
import './main.css';
import './media.css';    //媒体查询相应式处理css
const branch = 'master',    //当前项目分支
      special = false,        //是否为正章打印机
      version = '1.0.7';


class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedMenu:'offline',    //当前选中的菜单
            checkedOption:null,       //当前选中的路由选项
            checkedTab:null,          //当前选中的tab
            windows:{},    //窗口列表 key:{title:'tab内容',param:'携带参数',view:'界面路由'}
            token:localStorage.getItem('token'),
        };
        this.changeView = this.changeView.bind(this);
        this.changeMenu = this.changeMenu.bind(this);
        this.changeTab = this.changeTab.bind(this);
        this.tabClose = this.tabClose.bind(this);
    }

    //界面动态转换事件方法
    changeView(e) {
        let viewKey = null, option = this.state.checkedOption, param; 
        if (!tool.isSet(e.target)) {
            if (tool.isSet(e.view)) {
                viewKey = e.view;
                param = e.param;
            }
            tool.isSet(e.token) && this.setState({token:e.token});
        } else {
            let data = e.target.dataset;
            if (tool.isSet(data.view)) {
                viewKey = data.view;
                param = data.param;
            }
            if (tool.isSet(data.option)) option = data.option;
        }
        //窗口控制
        if (null === viewKey) return;
        if ('undefined' === typeof this.state.windows[viewKey]) {    //判断窗口列表中是否有该视图，若有则切换tab至该视图
            let route = router[this.state.checkedMenu][option];
            if (route.key !== viewKey) {    //当跳转界面不为当前路由所指向的key时,为窗口内部跳转,替换窗口内容,且不开启新tab
                viewKey = route.key;
            } else {
                //限制最多8个窗口
                if (tool.count(this.state.windows) >= 8) return alert('最多只能打开8个子窗口');
            }
            this.state.windows[route.key] = {
                title:route.value,    //tab标题文字
                param:param,          //窗口携带参数
                view:viewKey          //视图key
            };
            this.setState({windows:this.state.windows, checkedOption:option, checkedTab:viewKey});
        } else {
            this.setState({checkedTab:viewKey});
        }
    }

    changeMenu(e) {
        let menu = e.target.dataset.menu;
        this.state.checkedMenu !== menu && this.setState({checkedMenu:e.target.dataset.menu})
    }
    changeTab(e) {
        this.setState({checkedTab:e.target.dataset.view});
    }
    //tab关闭事件
    tabClose(e) {
        delete this.state.windows[e.target.parentNode.dataset.view];
        this.setState({checkedTab:tool.lastKey(this.state.windows), windows:this.state.windows});
        e.stopPropagation();
    }

    render() {
        let menuList = [], tabList = [], windowList = [], View = null;
        for (let k in menu) {
            menuList.push(
                <div
                    key={k} 
                    data-menu={k} 
                    className={this.state.checkedMenu === k ? 'checked' : null }
                    onClick={this.changeMenu}
                >{menu[k]}</div>
            );
        }
        let optionList = router[this.state.checkedMenu].map( (obj, index) =>
            <div
                key={obj.key}
                data-option={index}
                data-view={obj.key}
                className={this.state.checkedOption == index ? 'checked' : null}
                onClick={this.changeView}
            >{obj.value}</div>
        );
        for (let k in this.state.windows) {
            View = view[this.state.windows[k].view];
            tabList.push(
                <div 
                    key={k}
                    data-view={k}
                    onClick={this.changeTab}
                    className={this.state.checkedTab === k ? 'checked' : null}
                >{this.state.windows[k].title}<i className='tab-close' onClick={this.tabClose}></i></div>
            );
            windowList.push(
                <div 
                    key={k} 
                    className={`main-windows${this.state.checkedTab === k ? ' show' : ''}`}
                >
                    <View 
                        token={this.state.token}
                        param={this.state.windows[k].param}
                        changeView={this.changeView}
                        branch={branch}
                        special={special}
                    />
                </div>
            );
        }
        return (
            <div id='main'>
                <Top/>
                <div id='menu'>
                    <div className='menu-list'>{menuList}</div>
                    <div className='menu-employee'>操作员:test(111)</div>
                </div>
                <div id='option'>{optionList}</div>
                <div id='tab'>{tabList}</div>
                {windowList}
                {/* <div className='main-windows'></div> */}
            </div>
        );
    }
}


class Top extends Component {
    constructor(props) {
        super(props);
        this.state = {max:false};
        this.maxmize = this.maxmize.bind(this);
    }
    // 窗口最大化、还原控制
    maxmize() {
        this.state.max ? ipcRenderer.send('unmaximize-window', 'main') : ipcRenderer.send('maximize-window', 'main');
        this.setState({max:!this.state.max});
    }
    render() {
        return (
            <div id='top'>
                <div className='top-left'>速洗达商家管理系统</div>
                <div className='top-right'>
                    <div><div className='minimize' onClick={() => ipcRenderer.send('minimize-window', 'main')}></div></div>
                    <div><div className='maxmize' onClick={this.maxmize}></div></div>
                    <div><div className='closed' onClick={() => ipcRenderer.send('close-window', 'main')}></div></div>
                </div>
            </div>
        );
    }
}



ReactDOM.render(<Main/>,document.getElementById('root'));