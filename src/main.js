/**
 * 后台主界面组件
 * @author yangyunlong
 */

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './main.css';
import './api';
import {MyChart} from './static/UI';
import {FeedBack,UpdatePassword} from './main_layer';
import menus from './menus';
import route from './route';

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
            <header>
                <div>速洗达商家管理系统</div>
                <div>      
                    <span onClick={this.toggleFeedback}>
                        <i className="fa fa-pencil-square"></i>&nbsp;意见反馈
                    </span>
                    <span onClick={this.toggleUpdatePassword}>
                        <i className="fa fa-lock"></i>&nbsp;修改密码
                    </span>
                </div>
                {/* <FeedBack 
                    show={state.feedbackShow} 
                    onCancelRequest={this.toggleFeedback} 
                    token={token}
                />
                <UpdatePassword 
                    show={state.updatePasswordShow} 
                    onCancelRequest={this.toggleUpdatePassword} 
                    token={token}
                    uid={uid}
                /> */}
            </header>
        );
    }
}
//界面主体容器组件
class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name:null,status:null,logo:null,amount:null,count:null,    //数据状态
            option:null,  //菜单栏样式状态
            e:this.props.children,param:null    //右侧展示样式状态 附带参数
        };
        this.interval = null;
        this.handleContainerView = this.handleContainerView.bind(this);
        //注册组件列表
        this.elements = route;
        this.elements.index = Index;
        //this.handleScroll = this.handleScroll.bind(this);
        this.toggle = this.toggle.bind(this);
    }
    //获取店铺状态数据
    componentDidMount() {
        axios.post(api.U('index'),api.D({token:this.props.token}))
        .then(response => {
            let result = response.data.result;
            this.setState({
                name:result.mname,    //店铺名称
                status:(10 == result.mstatus ? 1 : 0),    //店铺状态   10营业中，11休息
                logo:result.mlogo,    //店铺头像
                amount:result.amount,    //今日营业总额
                count:result.order_count    //有效订单
            });         
        });
        setInterval(() => {
            axios.post(api.U('index'),api.D({token:this.props.token}))
            .then((response)=>{
                let result = response.data.result;
                this.setState({count:result.order_count});         
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
    //营业状态切换
    toggle() {
        let status = (this.state.status ? 0 : 1);    //操作当前店铺状态时，获取当前店铺状态并取反
        axios.post(api.U('toggle'),api.D({token:token,open:status}))
        .then(response => {        	
            if (api.V(response.data)) this.setState({status:status});
        });
    }
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
                count={state.count}
                selection={obj.selection} 
                options={obj.options} 
                option={state.option}
                changeView={this.handleContainerView}
            />
        );
        const E = this.elements[state.e];   //展示指定视图组件
        return (
            <div id='main'>
                <Header/>
                {/* 左侧菜单栏容器 */}
                <aside>
                    <div>
                        {/* 信息展示组件 */}
                        <Base name={state.name} status={state.status} logo={state.logo} toggle={this.toggle}/>
                        {/* 导航容器组件及导航栏视图组件 */}
                        <div id='main-nav'>{menusList}</div>
                    </div>
                </aside>
                {/* 右侧视图容器 */}
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
        );
    }
}
//侧边栏信息状态视图组件
class Base extends Component {
    constructor(props) {super(props)}
    render() {
        let props = this.props;
        return (
            <div id='main-base'>
                <div id="main-logo"><img src={props.logo} /></div>
                <div id="main-name">{props.name}</div>
                <div 
                    id="main-state" 
                    onClick={props.toggle} 
                    className={props.status ? 'main-open' : 'main-close'}
                >{props.status ? '营业中' : '休息中'}</div>
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
//      for (let i = 0;i < len;++i) {
//          this.auths.push(authList[auths[i]]);
//      }
//      for (let k in authList) {
//          this.authList.push(authList[k]);
//      }
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
    let  divList = [
                 {sort:'收件',order:1,e:'take'},
                 {sort:'入厂',order:2,e:'infactory'},
                 {sort:'清洗',order:3,e:'offline_clean'},
                 {sort:'烘干',order:4,e:'offline_drying'},
                 {sort:'熨烫',order:5,e:'offline_ironing'},
                 {sort:'质检',order:6,e:'offline_check'},
                 {sort:'上挂',order:7,e:'registration'},
                 {sort:'出厂',order:8,e:'outfactory'},
                 {sort:'取衣',order:9,e:'offline_take'},
                 {sort:'反流',order:10}
    ]
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {currentData:[],previousData:[]};
    }

    render() {
    	let comp = divList.map((elt)=>    		
    		    <div onClick={this.props.changeView} data-e={elt.e}>{elt.sort}</div>     		        		    
    	)
    	return (
    		<div >
	    		<div id='list-div'>
	    		   {comp}
	    		</div>
	    		<div className='members'>               
		             <div order='11'>新建会员</div>
		             <div order='12'>会员充值</div>
	            </div>
	        </div>
    	)
   }
}
//ReactDOM.render(<Header/>,document.getElementsByTagName('header')[0]);
ReactDOM.render(<Main token={token}>index</Main>,document.getElementById('root'));
/* 样式原因，所有组件根节点都要使用div */