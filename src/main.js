/**
 * 主界面组件
 * @author yangyunlong
 */

const {ipcRenderer} = window.require('electron');
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './tool';
import './api';    //注册全局api对象
import './main.css';
import './Elem/App.css';
import './media.css';    //媒体查询相应式处理css
import {menu, router, view} from './router';
window.version = '2.0.14';
const branch = 'master',    //当前项目分支
      special = false;        //是否为正章打印机



class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedMenu:'offline',    //当前选中的菜单
            checkedTab:'take',          //当前选中的tab
            show:false,               //操作选项是否显示
            windows:{
                take:{title:'收件', view:'take', param:null,history:[{view:'take', param:null}],forward:0}
            },    //窗口列表 key:{title:'tab内容',view:'界面路由',param:'携带参数',history:[{view:历史视图,param:历史参数}],forward:当前历史索引}
            token:localStorage.getItem('token'),
            merchant:{},    //商户信息
            employees:[],    //职员列表
            tempEmployee:''    //鼠标悬停临时展示的操作员名称
        };
        this.children = {};     //子窗口对象列表
        this.changeView = this.changeView.bind(this);
        this.changeMenu = this.changeMenu.bind(this);
        this.changeTab = this.changeTab.bind(this);
        this.closeView = this.closeView.bind(this);
        this.changeEmployee = this.changeEmployee.bind(this);
        this.hoverEmployee = this.hoverEmployee.bind(this);
        this.getEmployeeList = this.getEmployeeList.bind(this);
        this.onRef = this.onRef.bind(this);
        this.handleHistory = this.handleHistory.bind(this);
    }

    componentDidMount() {
        api.post('index', {token:this.state.token}, (response, verify) => {
            verify && this.setState({merchant:response.data.result});
        });
    }

    //界面动态转换事件方法
    changeView(e) {
        let view = null,    //视图
            param = null,    //视图携带参数
            option = null,
            checkedTab = this.state.checkedTab;    //当前选中的tab

        if ('object' === typeof e.target) {    //视图及参数赋值
            let data = e.target.dataset;
            if ('string' === typeof data.view) view = data.view;
            if ('undefined' !== typeof data.param) param = data.param;
            if ('string' === typeof data.option) option = data.option;
        } else {
            if ('string' === typeof e.view) view = e.view;
            if ('undefined' !== typeof e.param) param = e.param;
        }
        if (null === view) return;    //视图为空时停止界面跳转
        if (null === param && -1 !== view.indexOf('__')) param = view.split('__', 2)[1];    //检查视图名称中是否携带参数

        let checkedMenu = router[this.state.checkedMenu],    //当前选中的菜单中的视图列表
            routeIndex = view.inObjectArray(checkedMenu, 'key');    //判断跳转路由是否在当前视图列表中
        if (-1 === routeIndex) {    //跳转路由不存在当前视图列表中为窗口内跳转
            if (this.state.windows[checkedTab].view === view) return;    //选中的窗口与窗口内界面跳转的视图相同时,停止动作
            //判断跳转视图是否存在于历史缓存中，若不存在则追加进历史视图记录
            let historyIndex = view.inObjectArray(this.state.windows[checkedTab].history, 'view');
            if (-1 === historyIndex) {
                this.state.windows[checkedTab].history.push({view:view, param:param});
                ++this.state.windows[checkedTab].forward;
            } else {    //已存在时定位当前视图的历史索引
                this.state.windows[checkedTab].forward = historyIndex;
                this.state.windows[checkedTab].history[historyIndex].param = param;
            }
            this.state.windows[checkedTab].view = view;
            this.state.windows[checkedTab].param = param;
            this.setState({windows:this.state.windows});
        } else {    //跳转路由存在当前视图列表中为新建tab跳转
            if ('undefined' === typeof this.state.windows[view]) {    //若窗口列表中不存在该视图,新建tab创建视图窗口
                if (tool.count( this.state.windows ) >= 8) return alert('最多只能打开8个子窗口');    //限制最多8个窗口
                this.state.windows[view] = {
                    title:checkedMenu[routeIndex].value,
                    view:view,
                    param:param,
                    history:[{view:view, param:param}],    //历史记录
                    forward:0                              //视图索引
                };
                this.setState({checkedTab:view, windows:this.state.windows});
            } else if (this.state.windows[view].view !== view && 1 != option) {    //当窗口列表存在该视图,单视图内容不同时,且来源不为菜单选项时,为界面内返回跳转
                //历史记录迭代对象
                let historyIndex = view.inObjectArray(this.state.windows[view].history, 'view');
                if (-1 === historyIndex) {    //判断跳转视图是否存在于历史缓存中，若不存在则追加进历史视图记录
                    this.state.windows[view].history.push({view:view,param:param});
                    ++this.state.windows[view].forward;
                } else {    //已存在时定位当前视图的历史索引
                    this.state.windows[view].forward = historyIndex;
                    this.state.windows[checkedTab].history[historyIndex].param = param;
                }
                this.state.windows[view].view = view;
                this.state.windows[view].param = param;
                this.setState({windows:this.state.windows});
            } else {    //若窗口列表中存在该视图,定位tab至该视图
                'undefined' !== typeof this.children[view] && 'function' === typeof this.children[view].query && this.children[view].query();
                if (checkedTab === view && 1 == option) {
                    this.state.windows[view].view = view;
                    this.setState({windows:this.state.windows})
                } else {
                    this.setState({checkedTab:view});
                }
            }
            
        }
    }

    changeMenu(e) {
        let menu = e.target.dataset.menu;
        this.state.checkedMenu !== menu && this.setState({checkedMenu:e.target.dataset.menu})
    }
    //tab改变事件
    changeTab(e) {
        let key = e.target.dataset.key;
        'undefined' !== typeof this.children[key] && 'function' === typeof this.children[key].query && this.children[key].query();
        this.setState({checkedTab:key})
    }
    //tab关闭事件
    closeView(e) {
        delete this.state.windows[e.target.dataset.view];
        this.setState({checkedTab:tool.getObjectLastKey(this.state.windows), windows:this.state.windows});
        e.stopPropagation();
    }

    //切换员工
    changeEmployee(e) {
        let index = e.target.dataset.index,
            employee = this.state.employees[index];
        if (employee.id !== this.state.merchant.employeeID) {
            this.state.merchant.employee = employee.aname;
            this.state.merchant.employeeID = employee.id;
            let len = this.state.employees.length;
            for (let i = 0;i < len;++i) {
                this.state.employees[i].current = false;
            }
            this.state.employees[index].current = true;
            this.setState({merchant:this.state.merchant, token:employee.token, employees:this.state.employees});
            alert('操作员切换成功');
        }
    }
    hoverEmployee(e) {this.setState({tempEmployee:e.target.innerText})}
    getEmployeeList(e) {
        this.setState({show:true});
        if ('employee-handle' === e.target.className) {
            api.post('employees', {token:this.state.token}, (response, verify) => {
                verify && this.setState({employees:response.data.result});
            })
        }
    }
    // 获取子窗口对象
    onRef(ref) {this.children[this.state.checkedTab] = ref}
    //历史记录前进后退
    handleHistory(e) {
        let history = this.state.windows[this.state.checkedTab].history;
        let forward = this.state.windows[this.state.checkedTab].forward;
        if (1 == e.target.dataset.forward) {
            if (forward < ( history.length - 1 )) {
                ++forward;
                this.state.windows[this.state.checkedTab].view = history[forward].view;
                this.state.windows[this.state.checkedTab].param = history[forward].param;
                this.state.windows[this.state.checkedTab].forward = forward;
                this.setState({windows:this.state.windows});
            }
        } else {
            if (forward > 0) {
                --forward;
                this.state.windows[this.state.checkedTab].view = history[forward].view;
                this.state.windows[this.state.checkedTab].param = history[forward].param;
                this.state.windows[this.state.checkedTab].forward = forward;
                this.setState({windows:this.state.windows});
            }
        }
    }

    render() {
        let menuList = [],
            tabList = [], 
            windowList = [], 
            View;
        
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
                data-option='1'
                style={{backgroundImage:`url(img/${obj.key}.png)`}}
                onClick={this.changeView}
            >{obj.value}</div>
        );
        for (let k in this.state.windows) {
            View = view[this.state.windows[k].view];
            tabList.push(
                <div
                    key={k}
                    data-key={k}
                    onClick={this.changeTab}
                    className={this.state.checkedTab === k ? 'checked' : null}
                >{this.state.windows[k].title}<i className='tab-close' data-view={k} onClick={this.closeView}></i></div>
            );
            windowList.push(
                <div 
                    key={k} 
                    className={`main-windows${this.state.checkedTab === k ? ' show' : ''}`}
                >
                    <View 
                        token={this.state.token}
                        param={this.state.windows[k].param}
                        onRef={this.onRef}
                        changeView={this.changeView}
                        closeView={this.closeView}
                        branch={branch}
                        special={special}
                    />
                </div>
            );
        }
        let employees = this.state.employees.map( (obj, index) => 
            <div
                key={obj.id}
                data-index={index}
                className={obj.current ? 'checked' : null}
                onClick={this.changeEmployee}
                onMouseOver={this.hoverEmployee}
            >{obj.aname}</div>
        );
        return (
            <div id='main'>
                <Top name={this.state.merchant.mname} logo={this.state.merchant.mlogo}/>
                <div id='menu'>
                    <div className='menu-list'>{menuList}</div>
                    <div className='menu-employee'>
                        操作员：{this.state.merchant.employee}({this.state.merchant.employeeID})
                        <div
                            className='employee-handle'
                            onMouseOver={this.getEmployeeList}
                            onMouseOut={() => this.setState({show:false,tempEmployee:''})}
                        >
                            <div style={{display:this.state.show ? 'block' : 'none'}}>
                                <div className='employee-current'>操作员将切换为：{this.state.tempEmployee}</div>
                                {employees}
                            </div>
                        </div>
                    </div>
                    <div className='menu-control'>
                        <i
                            className={
                                `menu-control-back
                                ${
                                    tool.isSet(this.state.checkedTab)
                                    &&
                                    this.state.windows[this.state.checkedTab].forward > 0
                                    ? 
                                    ''
                                    :
                                    ' disabled'
                                }`
                            }
                            data-forward='0'
                            onClick={this.handleHistory}
                        ></i>
                        <i
                            className={
                                `menu-control-forward
                                ${
                                    tool.isSet(this.state.checkedTab)
                                    &&
                                    this.state.windows[this.state.checkedTab].forward < (this.state.windows[this.state.checkedTab].history.length - 1)
                                    ? 
                                    ''
                                    :
                                    ' disabled'
                                }`
                            }
                            data-forward='1'
                            onClick={this.handleHistory}
                        ></i>
                        <i
                            className='menu-control-refresh'
                            onClick={() => {
                                tool.isSet(this.state.checkedTab)
                                &&
                                'undefined' !== typeof this.children[this.state.checkedTab]
                                &&
                                'function' === typeof this.children[this.state.checkedTab].query
                                &&
                                this.children[this.state.checkedTab].query();
                            }}
                        ></i>
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
                >{this.props.name}（工厂版）</div>
                <div className='top-right'>
                    <div><div className='minimize' onClick={() => ipcRenderer.send('minimize-window', 'main')}></div></div>
                    <div><div className={this.state.max ? 'unmaximize' : 'maximize'} onClick={this.maxmize}></div></div>
                    <div><div className='closed' onClick={() => ipcRenderer.send('close-window', 'main')}></div></div>
                </div>
            </div>
        );
    }
}



ReactDOM.render(<Main/>,document.getElementById('root'));