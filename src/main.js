/**
 * 后台主界面组件
 * @author yangyunlong
 */
//const {ipcRenderer} = window.require('electron');
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './main.css';
import './static/api';
import {MyChart} from './static/UI';
import {FeedBack,UpdatePassword} from './main_layer';
import menus from './menus';
import route from './route';
//引入本地数据库
//import low from 'lowdb';
//import LocalStorage from 'lowdb/adapters/LocalStorage';

const token = localStorage.getItem('token');
const uid = localStorage.getItem('uid');
const auth = localStorage.getItem('auth');
const role = localStorage.getItem('role');
const authList = {
    '100':'线上订单',
    '1':'收衣',
    '2':'入厂',
    '3':'送洗',
    '4':'烘干',
    '5':'熨烫',
    '6':'质检',
    '7':'上挂',
    '8':'出厂',
    '9':'取衣',
    '10':'业务统计',
    '11':'会员管理'
};    //权限分配列表
const branch = 'master';

//界面头部组件
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {feedbackShow:false,updatePasswordShow:false};
        this.toggleFeedback = this.toggleFeedback.bind(this);
        this.toggleUpdatePassword = this.toggleUpdatePassword.bind(this);
    }
    toggleFeedback() {this.setState({feedbackShow:!this.state.feedbackShow});}
    toggleUpdatePassword() {this.setState({updatePasswordShow:!this.state.updatePasswordShow});}
    render() {
        let state = this.state;
        return (
            <div id='main-header'>
                <div id="main-hleft">速洗达商家管理系统</div>
                <div id="main-hright">
                    <span id="main-feedback" onClick={this.toggleFeedback}>意见反馈</span>
                    <span id="main-password" onClick={this.toggleUpdatePassword}>修改密码</span>
                    {/* <input 
                        type="button" 
                        value="退出" 
                        id="main-logout"
                        onClick={() => {ipcRenderer.send('close-main','close');}}
                    /> */}
                </div>
                <FeedBack 
                    show={state.feedbackShow} 
                    onCancelRequest={this.toggleFeedback} 
                    token={token}
                />
                <UpdatePassword 
                    show={state.updatePasswordShow} 
                    onCancelRequest={this.toggleUpdatePassword} 
                    token={token}
                    uid={uid}
                />
            </div>
        );
    }
}
//界面主体容器组件
class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name:null,status:null,logo:null,orders:null,amount:null,count:null,    //数据状态
            option:null,  //菜单栏样式状态
            e:this.props.children,param:null    //右侧展示样式状态 附带参数
        };
        this.interval = null;
        this.handleContainerView = this.handleContainerView.bind(this);
        //注册组件列表
        this.elements = route;
        this.elements.index = Index;
        //this.handleScroll = this.handleScroll.bind(this);
    }
    //获取店铺状态数据
    componentDidMount() {
        axios.post(api.U('index'),api.data({token:this.props.token,uid:uid}))
        .then((response)=>{
            let result = response.data.data;
            this.setState({
                name:result.mname,    //店铺名称
                status:result.state,    //店铺状态
                logo:'url(' +api.host+result.circle_logo+ ')',    //店铺头像
                orders:result.will_dispose,    //店铺待处理订单数
                amount:result.total,    //营业总额
                count:result.order_count    //有效订单
            });         
        });
        setInterval(() => {
            axios.post(api.U('index'),api.data({token:this.props.token,uid:uid}))
            .then((response)=>{
                let result = response.data.data;
                this.setState({orders:result.will_dispose});         
            });
        }, 60000);
    }

    componentWillUnmount() {
        if (null !== this.interval) {
            clearInterval(this.interval);
        }
    }
    /*handleScroll(e) {
        console.log(e.target);
        console.log(e.target.scrollTop);
    }*/

    handleContainerView(e) {    //右侧界面动态转换事件方法
        if ('undefined' === typeof e.target) {
            this.setState({e:e.element,param:e.param});
        } else {
            let dataset = e.target.dataset,
                element = dataset.e,
                option = dataset.option,
                param = dataset.param;
            if (
                'undefined' !== typeof element     //防止未注册组件崩溃
                && 
                this.state.e != element
            ) this.setState({e:element});
            if ('undefined' !== typeof option) this.setState({option:option});    //防止未注册菜单项
            if ('undefined' !== typeof param) this.setState({param:param});
        }
    }

    render() {
        let state = this.state,
            props = this.props,
            menusList = menus.map((obj) =>     //创建多个菜单组件
            <Menu 
                key={obj.id} 
                id={obj.id} 
                orders={state.orders}
                selection={obj.selection} 
                options={obj.options} 
                option={state.option}
                changeView={this.handleContainerView}
            />
        );
        const E = this.elements[state.e],    //展示指定视图组件
              mainStyle = {
                  height:'100%',width:'100%',
                  display:'flex',display:'-webkit-flex',
                  justifyContent:'space-between'
              };
        return (
            <div style={mainStyle}>
                {/* 左侧菜单栏容器 */}
                <aside id='main-sidebar'>
                     {/* 信息展示组件 */}
                    <Base token={props.token} name={state.name} status={state.status} logo={state.logo}/>
                    {/* 导航容器组件及导航栏视图组件 */}
                    <div id='main-nav'>{menusList}</div>
                </aside>
                {/* 右侧视图容器 */}
                <div id='main-container'>
                    {/* 视图组件 */}
                    <E 
                        token={props.token} 
                        uid={uid}
                        amount={state.amount} 
                        count={state.count} 
                        param={state.param}
                        changeView={this.handleContainerView}
                        branch={branch}
                    />
                </div>
            </div>
        );
    }
}
//侧边栏信息状态视图组件
class Base extends Component {
    constructor(props) {
        super(props);
        this.state = {status:null};
        this.statusSwitchover = this.statusSwitchover.bind(this);
    }
    statusSwitchover() {
        //操作当前店铺状态时，获取当前店铺状态并取反
        let status = this.state.status,
            pstatus = this.props.status,
            state = null == status ? (1 == pstatus ? 3 : 1) : (1 == status ? 3 : 1);
        axios.post(api.U('statusSwitchover'),api.data({token:this.props.token,state:state}))
        .then((response) => {
            if (api.verify(response.data)) this.setState({status:state});
        });
    }
    render() {
        let props = this.props,
            status = this.state.status,
            isOpen = null == status ? (1 == props.status) : (1 == status),
            bg = isOpen ? 'main-open' : 'main-close',
            word = isOpen ? '营业中' : '暂停营业';
        return (
            <div id='main-base'>
                <div id="main-logo" style={{backgroundImage:props.logo}}></div>
                <div id="main-name">{props.name}</div>
                <div id="main-state" onClick={this.statusSwitchover} className={bg}>{word}</div>
            </div>
        );
    }
}
//菜单视图组件
class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {isSpread:false}
        this.isBoss = ('1' == role);
        let auths = ('' != auth) ? auth.split(',') : [],
            len = auths.length;
        this.auths = [];
        this.authList = [];
        for (let i = 0;i < len;++i) {
            this.auths.push(authList[auths[i]]);
        }
        for (let k in authList) {
            this.authList.push(authList[k]);
        }
        this.chooseMenu = this.chooseMenu.bind(this);
        this.isShowOnline = this.isShowOnline.bind(this);
        this.isShowItem = this.isShowItem.bind(this);
    }

    isShowOnline(value) {
        if ('线上订单' == value) {
            if (this.isBoss || -1 != '线上订单'.inArray(this.auths)) return null;
            return {display:'none'};
        }
        return null;
    }

    isShowItem(value) {
        if (!this.isBoss) {
            if (-1 !== value.inArray(this.authList) && -1 == value.inArray(this.auths)) {
                return {display:'none'};
            }
        } 
        return null;
    }


    chooseMenu(e) {this.setState({isSpread:!this.state.isSpread});}
    render() {
        let props = this.props,
            isSpread = this.state.isSpread,
            sel = props.selection,
            opt = props.options,
            isShowOrders = 'order' == sel.id && props.orders > 0,
            status = isSpread ? 'main-spread' : 'main-shrink',    //判断当前大选项是否为选中状态
            optStatus = {display:isSpread ? 'block' : 'none'},
            items = opt.map((obj) => 
                //创建多个选项
                <div key={obj.id}>
                    <nav  
                        data-option={obj.id} 
                        data-e={obj.e}
                        className={props.option == obj.id ? 'main-chosen' : null} 
                        onClick={props.changeView}
                        style={this.isShowItem(obj.text)}
                    >
                        {obj.text}
                        {isShowOrders && '订单处理' == obj.text? <em className='main-tag'>{props.orders}</em> : ''}
                    </nav>
                </div>
            );
        return (
            <dl>
                <dt 
                    onClick={this.chooseMenu} 
                    className='main-selection'
                    style={this.isShowOnline(sel.text)}
                >
                    <div id={sel.id}>{sel.text}</div>
                    <div className={status} onClick={this.chooseMenu}></div>
                </dt>
                <dd className='main-option' style={optStatus}>{items}</dd>
            </dl>
        );
    }
}
//首页右侧展示
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {currentData:[],previousData:[]};
    }

    componentDidMount() {
        axios.post(
            api.U('operate'),
            api.data({token:this.props.token})
        )
        .then((respones) => {
            let result = respones.data.data;
            this.setState({
                currentData:result.now_sum,
                previousData:result.previous_sum,
            });
            console.log(result);
        });
    }

    render() {
        let props = this.props,
            state = this.state,
            count = props.count,
            amount = props.amount,
            amountArr = String(amount).split('.'),    //拆分价格显示
            wordStyle = {marginTop:'40px',fontSize:'18px'};
        if ('undefined' == typeof amountArr[1]) amountArr[1] = '00'
        if ('undefined' == typeof amountArr[0] || null == amountArr[0]) amountArr[0] = '0'
        return (
            <div style={{padding: '30px 30px 0 30px'}}>
                <section className='ui-content'>
                    <MyChart current={state.currentData} previous={state.previousData}/>
                </section>
                <section className='main-word'>
                    今日营业总额：
                    <span className='main-word-larger'>{amountArr[0] + '.'}</span>
                    <span>{amountArr[1]}</span>
                </section>
                <section className='main-word'>
                    今日有效订单：<span className='main-word-larger'>{amount}</span>
                </section>
            </div>
        );
    }
}

ReactDOM.render(<Header/>,document.getElementsByTagName('header')[0]);
ReactDOM.render(<Main token={token}>index</Main>,document.getElementById('main'));
/* 样式原因，所有组件根节点都要使用div */