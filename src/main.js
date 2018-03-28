/**
 * 主界面组件
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
            checkedTab:null,          //当前选中的tab
            show:false,               //操作选项是否显示
            windows:[],    //窗口列表 key:{title:'tab内容',param:'携带参数',view:'界面路由'}
            token:localStorage.getItem('token'),
            merchant:{},    //商户信息
        };
        this.changeView = this.changeView.bind(this);
        this.changeMenu = this.changeMenu.bind(this);
        this.changeTab = this.changeTab.bind(this);
        this.tabClose = this.tabClose.bind(this);
    }

    componentDidMount() {
        api.post('index', {token:this.state.token}, (response, verify) => {
            verify && this.setState({merchant:response.data.result});
        });
    }

    //界面动态转换事件方法
    changeView(e) {
        let view = null,    //视图
            checkedTab = this.state.checkedTab,    //当前选中的tab
            param;    //视图携带参数
        if (!tool.isSet(e.target)) {
            if (tool.isSet(e.view)) {
                view = e.view;
                param = e.param;
            }
            tool.isSet(e.token) && this.setState({token:e.token});
        } else {
            let data = e.target.dataset;
            if (tool.isSet(data.view)) {
                view = data.view;
                param = data.param;
            }
        }
        //窗口控制
        if (null === view) return;
        let checkedMenu = router[this.state.checkedMenu],    //当前选中的菜单列表
            routeIndex = view.inObjectArray(checkedMenu, 'key');    //选择的路由索引
        if (-1 === routeIndex) {    //判断当前菜单是否存在该路由
            //当前菜单不存在该路由,窗口内界面跳转
            if (this.state.windows[checkedTab].view === view) return;    //选中的窗口与窗口内界面跳转的视图相同时,停止动作
            this.state.windows[checkedTab].view = view;
            this.state.windows[checkedTab].param = param;
        } else {
            //当前菜单存在该路由,新建窗口跳转
            checkedTab = this.state.windows.length;                      //更新选中tab至最新tab
            if (checkedTab >= 8) return alert('最多只能打开8个子窗口');    //限制最多8个窗口
            this.state.windows.push({
                title:checkedMenu[routeIndex].value,
                tab:checkedTab,
                view:view,
                param:param
            });
        }
        this.setState({windows:this.state.windows, checkedTab:checkedTab});
    }

    changeMenu(e) {
        let menu = e.target.dataset.menu;
        this.state.checkedMenu !== menu && this.setState({checkedMenu:e.target.dataset.menu})
    }
    //tab改变事件
    changeTab(e) {this.setState({checkedTab:Number(e.target.dataset.index)})}
    //tab关闭事件
    tabClose(e) {
        this.state.windows.splice(e.target.parentNode.dataset.index, 1);
        this.setState({checkedTab:(this.state.windows.length - 1), windows:this.state.windows});
        e.stopPropagation();
    }

    render() {
        let menuList = [],
            tabList = [], 
            windowList = [], 
            len = this.state.windows.length, 
            View,
            tempView;
        
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
        let optionList = router[this.state.checkedMenu].map(obj =>
            <div
                key={obj.key}
                data-view={obj.key}
                style={{backgroundImage:`url(img/${obj.key}.png)`}}
                onClick={this.changeView}
            >{obj.value}</div>
        );
        for (let i = 0;i < len;++i) {
            tempView = this.state.windows[i].view;
            View = view[tempView];
            tabList.push(
                <div 
                    key={tempView + i}
                    data-index={i}
                    onClick={this.changeTab}
                    className={this.state.checkedTab === i ? 'checked' : null}
                >{this.state.windows[i].title}<i className='tab-close' onClick={this.tabClose}></i></div>
            );
            windowList.push(
                <div 
                    key={tempView + i} 
                    className={`main-windows${this.state.checkedTab === i ? ' show' : ''}`}
                >
                    <View 
                        token={this.state.token}
                        param={this.state.windows[i].param}
                        changeView={this.changeView}
                        branch={branch}
                        special={special}
                    />
                </div>
            );
        }
        return (
            <div id='main'>
                <Top name={this.state.merchant.mname} logo={this.state.merchant.mlogo}/>
                <div id='menu'>
                    <div className='menu-list'>{menuList}</div>
                    <div className='menu-employee'>
                        操作员：{this.state.merchant.employee}({this.state.merchant.employeeID})
                        <div
                            className='employee-handle'
                            onMouseOver={() => this.setState({show:true})}
                            onMouseOut={() => this.setState({show:false})}
                        >
                            <div style={{display:this.state.show ? 'block' : 'none'}}>
                                <div onClick={() => ipcRenderer.send('toggle-login')}>账号切换</div>
                                <div onClick={() => ipcRenderer.send('close-window', 'main')}>退出系统</div>
                            </div>
                        </div>
                    </div>
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
                <div
                    className='top-left' 
                    style={tool.isSet(this.props.logo) ? {backgroundImage:`url(${this.props.logo})`} : null}
                >{this.props.name}商家管理系统</div>
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